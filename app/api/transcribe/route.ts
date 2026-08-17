import OpenAI from "openai";
import { fetchTranscript } from "youtube-transcript";
import { extractYouTubeId, googleDriveDownloadUrl, isAcceptedMedia, MAX_MEDIA_BYTES, TranscriptSegment } from "@/lib/ww";
import { requireAuthenticatedUser, validatedPublicUrl } from "@/lib/server-guard";

type DiarizedResponse = {
  duration?: number;
  text?: string;
  segments?: Array<{ id?: string; start?: number; end?: number; text?: string; speaker?: string }>;
};

function apiKey() {
  const value = process.env.OPENAI_API_KEY;
  if (!value) throw new Error("A transcrição ainda não está configurada no servidor.");
  return value;
}

async function youtubeCaptions(url: string): Promise<{ duration: number; text: string; segments: TranscriptSegment[] }> {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error("Não foi possível identificar o vídeo do YouTube.");
  let captions: Awaited<ReturnType<typeof fetchTranscript>>;
  try {
    captions = await fetchTranscript(videoId);
  } catch {
    throw new Error("Este vídeo do YouTube não possui legendas públicas acessíveis. Envie o arquivo de áudio ou vídeo para transcrevê-lo.");
  }
  const usesMilliseconds = captions.some((item) => item.duration > 100);
  const divisor = usesMilliseconds ? 1000 : 1;
  const segments = captions.flatMap((item, index) => {
    const text = item.text.replace(/\s+/g, " ").trim();
    if (!text) return [];
    const start = item.offset / divisor;
    const end = start + Math.max(0.1, item.duration / divisor);
    return [{ id: `yt-${index}`, start, end, text, speaker: "A" } satisfies TranscriptSegment];
  });
  if (!segments.length) throw new Error("As legendas públicas do vídeo estavam vazias.");
  return {
    duration: segments.at(-1)?.end ?? 0,
    text: segments.map((segment) => segment.text).join(" "),
    segments,
  };
}

function filenameFromResponse(response: Response, url: URL) {
  const disposition = response.headers.get("content-disposition") ?? "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const basic = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  const path = url.pathname.split("/").filter(Boolean).at(-1);
  return decodeURIComponent(encoded ?? basic ?? path ?? "material.mp4");
}

async function downloadPublicMedia(value: string) {
  let url = validatedPublicUrl(googleDriveDownloadUrl(value));
  let response: Response | null = null;
  for (let redirect = 0; redirect < 4; redirect += 1) {
    response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "WW-Oficina-Editorial/1.0", accept: "audio/*,video/*,application/octet-stream" },
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get("location");
    if (!location) throw new Error("O link público respondeu com um redirecionamento inválido.");
    url = validatedPublicUrl(new URL(location, url).toString());
  }
  if (!response?.ok) throw new Error("Não foi possível baixar o material do link público.");
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > MAX_MEDIA_BYTES) throw new Error("O material ultrapassa o limite de 24 MB.");
  const contentType = (response.headers.get("content-type") ?? "application/octet-stream").split(";")[0];
  if (/^(text|application\/(json|xml|pdf))/.test(contentType)) {
    throw new Error("O link abriu uma página, não um arquivo público de áudio ou vídeo.");
  }
  const bytes = await response.arrayBuffer();
  const file = new File([bytes], filenameFromResponse(response, url), { type: contentType });
  if (!isAcceptedMedia(file)) throw new Error("O arquivo remoto precisa ser áudio ou vídeo compatível e ter até 24 MB.");
  return file;
}

async function transcribeFile(file: File) {
  const client = new OpenAI({ apiKey: apiKey() });
  const result = await client.audio.transcriptions.create({
    file,
    model: "gpt-4o-transcribe-diarize",
    response_format: "diarized_json",
    chunking_strategy: "auto",
  }) as DiarizedResponse;
  const segments = (result.segments ?? []).flatMap((segment, index) => {
    const text = segment.text?.trim();
    if (!text) return [];
    return [{
      id: segment.id ?? `segment-${index}`,
      start: segment.start ?? 0,
      end: segment.end ?? segment.start ?? 0,
      text,
      speaker: segment.speaker ?? "A",
    } satisfies TranscriptSegment];
  });
  if (!segments.length) throw new Error("A transcrição terminou sem falas reconhecíveis.");
  return { duration: result.duration ?? segments.at(-1)?.end ?? 0, text: result.text ?? segments.map((item) => item.text).join(" "), segments };
}

export async function POST(request: Request) {
  const authError = requireAuthenticatedUser(request);
  if (authError) return authError;
  try {
    const form = await request.formData();
    const uploaded = form.get("media");
    const mediaUrl = String(form.get("mediaUrl") ?? "").trim();
    let result: Awaited<ReturnType<typeof transcribeFile>>;
    let sourceKind: "file" | "public_url" | "youtube_captions";
    if (uploaded instanceof File && uploaded.size > 0) {
      if (!isAcceptedMedia(uploaded)) throw new Error("Envie um áudio ou vídeo compatível de até 24 MB.");
      result = await transcribeFile(uploaded);
      sourceKind = "file";
    } else if (mediaUrl) {
      validatedPublicUrl(mediaUrl);
      if (extractYouTubeId(mediaUrl)) {
        result = await youtubeCaptions(mediaUrl);
        sourceKind = "youtube_captions";
      } else {
        result = await transcribeFile(await downloadPublicMedia(mediaUrl));
        sourceKind = "public_url";
      }
    } else {
      throw new Error("Envie um arquivo ou informe um link público.");
    }
    return Response.json({ ...result, sourceKind, speakers: [...new Set(result.segments.map((segment) => segment.speaker))] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível transcrever o material.";
    const status = /configurada no servidor/.test(message) ? 503 : 422;
    return Response.json({ error: message }, { status });
  }
}
