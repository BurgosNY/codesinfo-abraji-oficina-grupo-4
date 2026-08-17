"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { EditorialDraft, EditorialSection, formatTimecode, isAcceptedMedia, Reading, SpeakerCredit, TranscriptSegment } from "@/lib/ww";

type LinkRow = { id: number; url: string };
type SourceMode = "file" | "link";
type Stage = "input" | "transcribing" | "review" | "generating" | "delivery";
type OutputView = "draft" | "transcript";

const nextId = () => Date.now() + Math.floor(Math.random() * 999);

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function pdfText(value: string) {
  return value.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/…/g, "...");
}

async function responseError(response: Response) {
  try {
    const payload = await response.json() as { error?: string };
    return payload.error ?? `A operação falhou (${response.status}).`;
  } catch {
    return `A operação falhou (${response.status}).`;
  }
}

function SectionPreview({ number, title, section }: { number: string; title: string; section: EditorialSection }) {
  return <section>
    <span className="section-number">{number}</span>
    <h2>{title}</h2>
    <p>{section.body}</p>
    <blockquote>“{section.quoteText}” <cite>— {section.quoteSpeaker}, {section.quoteCredit} · {section.quoteTimecode}</cite></blockquote>
  </section>;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [mode, setMode] = useState<SourceMode>("file");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [cnnLinks, setCnnLinks] = useState<LinkRow[]>([{ id: 1, url: "" }]);
  const [readings, setReadings] = useState<Reading[]>([{ id: 1, url: "", reason: "" }]);
  const [relevance, setRelevance] = useState("");
  const [message, setMessage] = useState("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [speakerCredits, setSpeakerCredits] = useState<Record<string, SpeakerCredit>>({});
  const [draft, setDraft] = useState<EditorialDraft | null>(null);
  const [view, setView] = useState<OutputView>("draft");
  const [errors, setErrors] = useState<string[]>([]);
  const [sourceKind, setSourceKind] = useState("");

  const sourceLabel = mode === "file" ? mediaFile?.name : mediaUrl;
  const speakers = useMemo(() => [...new Set(segments.map((segment) => segment.speaker))], [segments]);
  const currentStep = stage === "input" || stage === "transcribing" ? 1 : stage === "review" || stage === "generating" ? 2 : 3;

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setMediaFile(file);
    setMediaUrl("");
    setErrors([]);
  }

  function validateInputs() {
    const next: string[] = [];
    if (mode === "file" && !mediaFile) next.push("Envie um arquivo de áudio ou vídeo.");
    if (mode === "file" && mediaFile && !isAcceptedMedia(mediaFile)) next.push("Use áudio ou vídeo compatível de até 24 MB.");
    if (mode === "link" && !validUrl(mediaUrl)) next.push("Informe um link público HTTP ou HTTPS.");
    if (!cnnLinks.length || cnnLinks.some((item) => !validUrl(item.url))) next.push("Preencha ao menos um link CNN válido.");
    if (relevance.trim().length < 20) next.push("Explique a relevância com pelo menos 20 caracteres.");
    if (message.trim().length < 20) next.push("Defina a mensagem principal com pelo menos 20 caracteres.");
    if (!readings.length || readings.some((item) => !validUrl(item.url) || item.reason.trim().length < 12)) next.push("Cada recomendação precisa de link válido e justificativa com pelo menos 12 caracteres.");
    setErrors(next);
    return next.length === 0;
  }

  async function transcribe(event: FormEvent) {
    event.preventDefault();
    if (!validateInputs()) return;
    setErrors([]);
    setStage("transcribing");
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const form = new FormData();
      if (mode === "file" && mediaFile) form.set("media", mediaFile);
      if (mode === "link") form.set("mediaUrl", mediaUrl);
      const response = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!response.ok) throw new Error(await responseError(response));
      const payload = await response.json() as { segments: TranscriptSegment[]; speakers: string[]; sourceKind: string };
      setSegments(payload.segments);
      setSpeakerCredits(Object.fromEntries(payload.speakers.map((speaker) => [speaker, { name: "", credit: "" }])));
      setSourceKind(payload.sourceKind);
      setStage("review");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Não foi possível transcrever o material."]);
      setStage("input");
    }
  }

  async function generateDraft() {
    const next = speakers.flatMap((speaker) => {
      const credit = speakerCredits[speaker];
      return credit?.name.trim().length >= 2 && credit?.credit.trim().length >= 2
        ? []
        : [`Informe nome e crédito para o participante ${speaker}.`];
    });
    if (segments.some((segment) => !segment.text.trim())) next.push("A transcrição contém um trecho vazio.");
    if (next.length) {
      setErrors(next);
      return;
    }
    setErrors([]);
    setStage("generating");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ segments, speakerCredits, cnnLinks, readings, relevance, message }),
      });
      if (!response.ok) throw new Error(await responseError(response));
      const payload = await response.json() as { draft: EditorialDraft };
      setDraft(payload.draft);
      setView("draft");
      setStage("delivery");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Não foi possível gerar o rascunho."]);
      setStage("review");
    }
  }

  function updateSpeaker(speaker: string, field: keyof SpeakerCredit, value: string) {
    setSpeakerCredits((current) => ({
      ...current,
      [speaker]: { ...current[speaker], [field]: value },
    }));
  }

  function updateSegment(id: string, text: string) {
    setSegments((current) => current.map((segment) => segment.id === id ? { ...segment, text } : segment));
  }

  function resetToInputs() {
    setDraft(null);
    setSegments([]);
    setSpeakerCredits({});
    setErrors([]);
    setStage("input");
  }

  async function createPdf(title: string) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setProperties({ title, subject: "Rascunho editorial interno do WW" });
    return doc;
  }

  async function downloadDraftPdf() {
    if (!draft) return;
    const doc = await createPdf(draft.headline);
    let y = 18;
    const write = (text: string, options: { size?: number; bold?: boolean; gap?: number } = {}) => {
      const size = options.size ?? 10;
      doc.setFont("helvetica", options.bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(pdfText(text), 176) as string[];
      const height = lines.length * (size * 0.45);
      if (y + height > 278) { doc.addPage(); y = 18; }
      doc.text(lines, 16, y);
      y += height + (options.gap ?? 5);
    };
    doc.setFillColor(17, 27, 45);
    doc.rect(0, 0, 210, 31, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("WW Oficina Editorial", 16, 15);
    doc.setFontSize(9);
    doc.text("RASCUNHO - REVISAR E APROVAR ANTES DA PUBLICACAO", 16, 24);
    doc.setTextColor(25);
    y = 43;
    write(draft.headline, { size: 18, bold: true, gap: 7 });
    write(draft.dek, { size: 11, gap: 10 });
    const sections: Array<[string, EditorialSection]> = [
      ["1. O que aconteceu?", draft.whatHappened],
      ["2. Por que isso importa?", draft.whyItMatters],
      ["3. O que observar daqui em diante?", draft.whatToWatch],
    ];
    for (const [title, section] of sections) {
      write(title, { size: 14, bold: true, gap: 6 });
      write(section.body, { gap: 5 });
      write(`\"${section.quoteText}\" - ${section.quoteSpeaker}, ${section.quoteCredit} (${section.quoteTimecode})`, { size: 9, gap: 10 });
    }
    write("4. Para aprofundar o tema", { size: 14, bold: true, gap: 6 });
    readings.forEach((reading, index) => write(`${index + 1}. ${reading.reason}\n${reading.url}`, { gap: 7 }));
    if (draft.warnings.length) {
      write("Pontos para a revisao editorial", { size: 12, bold: true, gap: 5 });
      draft.warnings.forEach((warning) => write(`- ${warning}`, { size: 9, gap: 4 }));
    }
    doc.save("ww-rascunho-editorial.pdf");
  }

  async function downloadTranscriptPdf() {
    if (!draft) return;
    const doc = await createPdf("WW - Transcrição e trechos sugeridos");
    let y = 18;
    const write = (text: string, size = 9, bold = false, gap = 5) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(pdfText(text), 176) as string[];
      const height = lines.length * (size * 0.45);
      if (y + height > 280) { doc.addPage(); y = 18; }
      doc.text(lines, 16, y);
      y += height + gap;
    };
    write("WW - Transcricao com timecodes", 18, true, 9);
    segments.forEach((segment) => {
      const credit = speakerCredits[segment.speaker];
      write(`${formatTimecode(segment.start)}-${formatTimecode(segment.end)} | ${credit.name}, ${credit.credit}`, 9, true, 3);
      write(segment.text, 9, false, 7);
    });
    write("Trechos sugeridos para redes sociais", 14, true, 7);
    draft.clips.forEach((clip) => {
      write(`${formatTimecode(clip.start)}-${formatTimecode(clip.end)} | ${clip.title}`, 10, true, 3);
      write(`\"${clip.quote}\"\n${clip.reason}`, 9, false, 8);
    });
    doc.save("ww-transcricao-e-trechos.pdf");
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">WW</span><span>OFICINA EDITORIAL</span></a>
      <span className="prototype">USO INTERNO · REVISÃO HUMANA OBRIGATÓRIA</span>
    </header>
    <div className="security-bar"><b>PROCESSAMENTO REAL</b><span>O material é enviado ao servidor somente para transcrição e geração desta sessão. O aplicativo não publica nem armazena o conteúdo.</span></div>
    <div className="shell" id="top">
      <aside className="rail" aria-label="Etapas">
        {([[1, "Insumos", "Materiais autorizados"], [2, "Revisão", "Transcrição e créditos"], [3, "Entrega", "Prévia e PDFs"]] as const).map(([number, label, help]) => <div key={number} className={`rail-step ${currentStep === number ? "active" : currentStep > number ? "done" : ""}`}><span>0{number}</span><div><b>{label}</b><small>{help}</small></div></div>)}
        <div className="privacy-note"><b>Controle editorial</b><p>Somente os materiais enviados entram no rascunho. Nenhuma fonte externa é consultada e nenhuma publicação é automática.</p></div>
      </aside>

      {stage === "input" && <section className="workspace">
        <div className="intro"><p className="eyebrow">NOVA PÁGINA DE APROFUNDAMENTO</p><h1>Do bloco ao rascunho, com origem verificável.</h1><p>Envie o material do programa e as decisões da redação. A ferramenta transcreve, permite revisar créditos e produz a primeira versão editorial.</p></div>
        <form onSubmit={transcribe} noValidate>
          <section className="form-card"><div className="section-title"><span>1</span><div><h2>Material de origem</h2><p>Áudio, vídeo ou link público. Limite de 24 MB para arquivos.</p></div></div><div className="mode-tabs"><button type="button" className={mode === "file" ? "active" : ""} onClick={() => setMode("file")}>Enviar arquivo</button><button type="button" className={mode === "link" ? "active" : ""} onClick={() => setMode("link")}>Usar link público</button></div>
            {mode === "file" ? <label className={`media-upload ${mediaFile ? "selected" : ""}`}><input type="file" accept="audio/*,video/*,.flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm" onChange={chooseFile}/><span>ÁUDIO / VÍDEO</span><b>{mediaFile?.name ?? "Escolha um arquivo"}</b><small>FLAC, MP3, MPEG, MP4, M4A, OGG, WAV ou WebM · até 24 MB</small></label> : <label className="public-link"><b>LINK ABERTO DO MATERIAL</b><input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="YouTube com legenda pública, Drive aberto ou arquivo direto"/><small>Links do YouTube precisam ter legendas públicas; no Drive, o arquivo deve estar liberado para qualquer pessoa.</small></label>}
          </section>
          <section className="form-card"><div className="section-title"><span>2</span><div><h2>Conteúdos CNN selecionados</h2><p>A ferramenta lerá apenas páginas do ecossistema CNN.</p></div></div><div className="stack">{cnnLinks.map((item, index) => <div className="row" key={item.id}><label><small>LINK {index + 1}</small><input value={item.url} onChange={(event) => setCnnLinks(cnnLinks.map((link) => link.id === item.id ? { ...link, url: event.target.value } : link))} placeholder="https://www.cnnbrasil.com.br/..."/></label>{cnnLinks.length > 1 && <button type="button" className="remove" onClick={() => setCnnLinks(cnnLinks.filter((link) => link.id !== item.id))}>Remover</button>}</div>)}</div><button type="button" className="add" onClick={() => setCnnLinks([...cnnLinks, { id: nextId(), url: "" }])}>+ Adicionar conteúdo</button></section>
          <section className="form-card"><div className="section-title"><span>3</span><div><h2>Orientação editorial</h2><p>As duas respostas orientam a hierarquia do texto.</p></div></div><label className="question"><b>Por que este tema é relevante para o público? *</b><textarea value={relevance} onChange={(event) => setRelevance(event.target.value)} maxLength={1200}/><small>{relevance.length}/1200</small></label><label className="question"><b>Qual é a principal mensagem que o público deve levar desta cobertura? *</b><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200}/><small>{message.length}/1200</small></label></section>
          <section className="form-card"><div className="section-title"><span>4</span><div><h2>Para aprofundar</h2><p>Somente estas recomendações entrarão na quarta seção.</p></div></div>{readings.map((item, index) => <div className="recommendation" key={item.id}><div className="rec-head"><b>RECOMENDAÇÃO {index + 1}</b>{readings.length > 1 && <button type="button" className="remove" onClick={() => setReadings(readings.filter((reading) => reading.id !== item.id))}>Remover</button>}</div><input value={item.url} onChange={(event) => setReadings(readings.map((reading) => reading.id === item.id ? { ...reading, url: event.target.value } : reading))} placeholder="Link da leitura"/><textarea value={item.reason} onChange={(event) => setReadings(readings.map((reading) => reading.id === item.id ? { ...reading, reason: event.target.value } : reading))} placeholder="Por que esta leitura ajuda?"/></div>)}<button type="button" className="add" onClick={() => setReadings([...readings, { id: nextId(), url: "", reason: "" }])}>+ Adicionar recomendação</button></section>
          {errors.length > 0 && <div className="error-box" role="alert"><b>Revise antes de continuar:</b><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          <div className="submit-area"><p>O próximo passo transcreve o material de verdade.</p><button className="primary">Transcrever material →</button></div>
        </form>
      </section>}

      {stage === "transcribing" && <section className="processing"><p className="eyebrow">TRANSCRIÇÃO EM ANDAMENTO</p><h1>Ouvindo o material<br/>e separando as falas.</h1><div className="live-status"><span className="status-pulse"/><div><b>Transcrição e identificação de participantes</b><p>Arquivos maiores podem levar alguns minutos. Mantenha esta página aberta.</p></div></div></section>}

      {(stage === "review" || stage === "generating") && <section className="review-workspace">
        <div className="delivery-head"><div><p className="eyebrow">REVISÃO DA TRANSCRIÇÃO</p><h1>Confirme quem disse o quê.</h1><p>Origem: {sourceLabel} · {sourceKind === "youtube_captions" ? "legendas públicas do YouTube" : "transcrição de áudio/vídeo"}</p></div><button className="back" onClick={resetToInputs} disabled={stage === "generating"}>← Trocar material</button></div>
        <div className="review-note"><b>Antes de gerar</b><span>Preencha nome e crédito de cada participante. Corrija abaixo qualquer trecho necessário; o rascunho usará exatamente esta versão.</span></div>
        <section className="speaker-card"><h2>Participantes e créditos</h2><div className="speaker-grid">{speakers.map((speaker) => <div key={speaker} className="speaker-row"><span>{speaker}</span><label><small>NOME</small><input value={speakerCredits[speaker]?.name ?? ""} onChange={(event) => updateSpeaker(speaker, "name", event.target.value)} placeholder="Nome completo"/></label><label><small>CRÉDITO</small><input value={speakerCredits[speaker]?.credit ?? ""} onChange={(event) => updateSpeaker(speaker, "credit", event.target.value)} placeholder="Cargo ou função"/></label></div>)}</div></section>
        <section className="transcript-review"><div className="review-heading"><div><h2>Transcrição com timecodes</h2><p>{segments.length} trechos reconhecidos</p></div><span>EDITÁVEL</span></div>{segments.map((segment) => <article key={segment.id}><time>{formatTimecode(segment.start)}–{formatTimecode(segment.end)}</time><b>Participante {segment.speaker}</b><textarea value={segment.text} onChange={(event) => updateSegment(segment.id, event.target.value)}/></article>)}</section>
        {errors.length > 0 && <div className="error-box" role="alert"><b>Não foi possível continuar:</b><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        <div className="submit-area"><p>Os links CNN serão lidos agora; nenhuma outra fonte será usada.</p><button className="primary" onClick={generateDraft} disabled={stage === "generating"}>{stage === "generating" ? "Gerando rascunho…" : "Gerar página →"}</button></div>
      </section>}

      {stage === "delivery" && draft && <section className="delivery"><div className="delivery-head"><div><p className="eyebrow">ENTREGA DA SESSÃO</p><h1>Rascunho pronto para revisão.</h1><p>Origem: {sourceLabel}</p></div><button className="back" onClick={() => setStage("review")}>← Revisar transcrição</button></div><div className="draft-warning"><b>Rascunho — revisar e aprovar antes da publicação</b><span>Nenhum conteúdo foi enviado a CMS ou publicado automaticamente.</span></div>
        {draft.warnings.length > 0 && <div className="warning-list"><b>Pontos que exigem atenção editorial</b><ul>{draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
        <div className="download-row"><button onClick={downloadDraftPdf}><span>PDF 01</span><b>Baixar rascunho principal</b><small>Texto, citações, créditos e leituras</small></button><button onClick={downloadTranscriptPdf}><span>PDF 02</span><b>Baixar transcrição e trechos</b><small>Timecodes e sugestões sociais reais</small></button></div><nav className="output-tabs"><button className={view === "draft" ? "active" : ""} onClick={() => setView("draft")}>Prévia da página</button><button className={view === "transcript" ? "active" : ""} onClick={() => setView("transcript")}>Transcrição e trechos</button></nav>
        {view === "draft" ? <article className="article-preview"><p className="eyebrow">PÁGINA DE APROFUNDAMENTO · PRÉVIA</p><h1>{draft.headline}</h1><p className="dek">{draft.dek}</p><div className="source-strip"><b>Materiais usados</b><span>{cnnLinks.length} conteúdo(s) CNN</span><span>{readings.length} leitura(s)</span><span>{segments.length} trecho(s) transcritos</span></div><SectionPreview number="01" title="O que aconteceu?" section={draft.whatHappened}/><SectionPreview number="02" title="Por que isso importa?" section={draft.whyItMatters}/><SectionPreview number="03" title="O que observar daqui em diante?" section={draft.whatToWatch}/><section><span className="section-number">04</span><h2>Para aprofundar o tema</h2><div className="reading-list">{readings.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer"><span>{validUrl(item.url)?.hostname}</span><b>{item.reason}</b><small>Abrir leitura ↗</small></a>)}</div></section></article> : <div className="transcript-view"><div className="verified-note"><b>TRANSCRIÇÃO PROCESSADA</b> Os timecodes abaixo vieram do material desta sessão e os créditos foram confirmados na etapa anterior.</div><div className="transcript-list">{segments.map((segment) => { const credit = speakerCredits[segment.speaker]; return <article key={segment.id}><time>{formatTimecode(segment.start)}</time><div><b>{credit.name}, {credit.credit}</b><p>{segment.text}</p></div></article>; })}</div><h2>Trechos sugeridos para redes sociais</h2><div className="clip-grid">{draft.clips.map((clip) => <article key={`${clip.start}-${clip.end}`}><span>{formatTimecode(clip.start)} → {formatTimecode(clip.end)}</span><b>{clip.title}</b><blockquote>“{clip.quote}”</blockquote><p>{clip.reason}</p><small>Duração {formatTimecode(clip.end - clip.start)} · até 1 minuto</small></article>)}</div></div>}
      </section>}
    </div>
  </main>;
}
