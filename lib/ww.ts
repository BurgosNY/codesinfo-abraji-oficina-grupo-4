export const MAX_MEDIA_BYTES = 24 * 1024 * 1024;

export type TranscriptSegment = {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker: string;
};

export type SpeakerCredit = {
  name: string;
  credit: string;
};

export type Reading = {
  id: number;
  url: string;
  reason: string;
};

export type EditorialSection = {
  body: string;
  quoteText: string;
  quoteSpeaker: string;
  quoteCredit: string;
  quoteTimecode: string;
};

export type SocialClip = {
  start: number;
  end: number;
  title: string;
  reason: string;
  quote: string;
};

export type EditorialDraft = {
  headline: string;
  dek: string;
  whatHappened: EditorialSection;
  whyItMatters: EditorialSection;
  whatToWatch: EditorialSection;
  clips: SocialClip[];
  warnings: string[];
};

export function formatTimecode(value: number) {
  const seconds = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":")
    : [minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":");
}

export function extractYouTubeId(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ?? null;
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

export function googleDriveDownloadUrl(value: string) {
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith("drive.google.com")) return value;
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    const id = match?.[1] ?? url.searchParams.get("id");
    return id
      ? `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`
      : value;
  } catch {
    return value;
  }
}

export function isAcceptedMedia(file: { name: string; type: string; size: number }) {
  const acceptedExtension = /\.(flac|mp3|mp4|mpeg|mpga|m4a|ogg|wav|webm)$/i.test(file.name);
  const acceptedMime = /^(audio|video)\//.test(file.type);
  return file.size > 0 && file.size <= MAX_MEDIA_BYTES && (acceptedExtension || acceptedMime);
}

export function normalizeForComparison(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}
