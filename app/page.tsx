"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type LinkItem = { id: number; url: string };
type Recommendation = { id: number; url: string; reason: string };
type Draft = { happened: string; matters: string; watch: string; quotes: string[] };

const makeId = () => Date.now() + Math.floor(Math.random() * 1000);

function cleanUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function sentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 35 && !/^https?:/i.test(item));
}

function makeDraft(transcript: string, relevance: string, message: string): Draft {
  const source = sentences(transcript);
  const quotePattern = /[“\"]([^”\"]{12,180})[”\"]\s*(?:—|-|,)?\s*([^\n,.—-]{2,50})(?:,\s*([^\n.]{2,60}))?/g;
  const quotes: string[] = [];
  const authors = new Set<string>();
  for (const match of transcript.matchAll(quotePattern)) {
    const author = match[2].trim();
    if (!authors.has(author.toLowerCase())) {
      authors.add(author.toLowerCase());
      quotes.push(`“${match[1].trim()}” — ${author}${match[3] ? `, ${match[3].trim()}` : ""}`);
    }
  }
  const fallback = "Os insumos não trazem informação suficiente para desenvolver esta seção sem completar lacunas.";
  return {
    happened: source.slice(0, 2).join(" ") || fallback,
    matters: `${relevance.trim()}${source[2] ? ` ${source[2]}` : ""}`,
    watch: `${message.trim()}${source[3] ? ` ${source[3]}` : ""}`,
    quotes: quotes.slice(0, 3),
  };
}

export default function Home() {
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [cnnLinks, setCnnLinks] = useState<LinkItem[]>([{ id: 1, url: "" }]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: 1, url: "", reason: "" },
  ]);
  const [relevance, setRelevance] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const validLinks = useMemo(
    () => cnnLinks.map((item) => cleanUrl(item.url)).filter(Boolean),
    [cnnLinks],
  );

  async function readTranscript(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setTranscriptFile(file);
    setVideoFile(null);
    if (!file) return setTranscript("");
    if (/\.(txt|md)$/i.test(file.name) || file.type.startsWith("text/")) {
      setTranscript(await file.text());
    } else {
      setTranscript("");
    }
  }

  function readVideo(event: ChangeEvent<HTMLInputElement>) {
    setVideoFile(event.target.files?.[0] ?? null);
    setTranscriptFile(null);
    setTranscript("");
  }

  function validate() {
    const next: string[] = [];
    if (!transcriptFile && !videoFile) next.push("Envie uma transcrição ou um vídeo.");
    if (transcriptFile && !transcript && /\.docx?$/i.test(transcriptFile.name)) {
      next.push("Nesta demonstração, documentos Word precisam ser exportados como .txt para leitura segura.");
    }
    if (!cnnLinks.length || validLinks.length !== cnnLinks.length) {
      next.push("Preencha ao menos um link válido de conteúdo CNN.");
    }
    if (relevance.trim().length < 20) next.push("Explique a relevância para o público com pelo menos 20 caracteres.");
    if (message.trim().length < 20) next.push("Defina a mensagem principal com pelo menos 20 caracteres.");
    if (
      !recommendations.length ||
      recommendations.some((item) => !cleanUrl(item.url) || item.reason.trim().length < 12)
    ) {
      next.push("Cada recomendação precisa de link válido e justificativa com pelo menos 12 caracteres.");
    }
    setErrors(next);
    return next.length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    setDraft(null);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setDraft(
      videoFile
        ? {
            happened: "O vídeo foi recebido, mas esta demonstração não transcreve arquivos automaticamente. A redação precisa fornecer uma transcrição para que fatos e citações sejam sintetizados com segurança.",
            matters: relevance.trim(),
            watch: message.trim(),
            quotes: [],
          }
        : makeDraft(transcript, relevance, message),
    );
    setProcessing(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const quoteFor = (index: number) => draft?.quotes[index] ?? null;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="WW Oficina Editorial">
          <span className="brand-mark">WW</span>
          <span>OFICINA EDITORIAL</span>
        </a>
        <span className="prototype">PROTÓTIPO · AMBIENTE DE TESTE</span>
      </header>

      <div className="shell" id="top">
        <aside className="rail" aria-label="Etapas">
          <div className={`rail-step ${step === 1 ? "active" : "done"}`}>
            <span>01</span><div><b>Insumos</b><small>Materiais e orientação</small></div>
          </div>
          <div className={`rail-step ${step === 2 ? "active" : ""}`}>
            <span>02</span><div><b>Prévia</b><small>Rascunho editorial</small></div>
          </div>
          <div className="privacy-note">
            <b>Nada é publicado</b>
            <p>Os arquivos ficam somente nesta sessão do navegador. Esta demonstração não consulta fontes externas.</p>
          </div>
        </aside>

        {step === 1 ? (
          <section className="workspace">
            <div className="intro">
              <p className="eyebrow">NOVA PÁGINA DE APROFUNDAMENTO</p>
              <h1>Transforme análise em uma primeira versão estruturada.</h1>
              <p>Reúna os materiais autorizados. O rascunho será construído exclusivamente com o que você fornecer.</p>
            </div>

            <form onSubmit={submit} noValidate>
              <section className="form-card">
                <div className="section-title"><span>1</span><div><h2>Material de origem</h2><p>Escolha transcrição ou vídeo.</p></div></div>
                <div className="upload-grid">
                  <label className={`upload ${transcriptFile ? "selected" : ""}`}>
                    <input type="file" accept=".txt,.md,.doc,.docx,text/plain" onChange={readTranscript} />
                    <span className="upload-icon">TXT</span><b>Enviar transcrição</b>
                    <small>{transcriptFile?.name ?? ".txt, .md ou documento"}</small>
                  </label>
                  <div className="or">OU</div>
                  <label className={`upload ${videoFile ? "selected" : ""}`}>
                    <input type="file" accept="video/*" onChange={readVideo} />
                    <span className="upload-icon">▶</span><b>Enviar trecho em vídeo</b>
                    <small>{videoFile?.name ?? "MP4, MOV ou WebM"}</small>
                  </label>
                </div>
                {transcript && <div className="read-ok">✓ {transcript.split(/\s+/).length} palavras lidas localmente</div>}
              </section>

              <section className="form-card">
                <div className="section-title"><span>2</span><div><h2>Conteúdos CNN selecionados</h2><p>Inclua apenas links já escolhidos pela redação.</p></div></div>
                <div className="stack">
                  {cnnLinks.map((item, index) => (
                    <div className="row" key={item.id}>
                      <label><small>LINK {index + 1}</small><input type="url" placeholder="https://www.cnnbrasil.com.br/..." value={item.url} onChange={(e) => setCnnLinks(cnnLinks.map((link) => link.id === item.id ? { ...link, url: e.target.value } : link))} /></label>
                      {cnnLinks.length > 1 && <button type="button" className="remove" onClick={() => setCnnLinks(cnnLinks.filter((link) => link.id !== item.id))}>Remover</button>}
                    </div>
                  ))}
                </div>
                <button type="button" className="add" onClick={() => setCnnLinks([...cnnLinks, { id: makeId(), url: "" }])}>+ Adicionar conteúdo</button>
              </section>

              <section className="form-card">
                <div className="section-title"><span>3</span><div><h2>Orientação editorial</h2><p>Essas respostas são obrigatórias e guiam a síntese.</p></div></div>
                <label className="question"><b>Por que este tema é relevante para o público? <em>*</em></b><textarea value={relevance} onChange={(e) => setRelevance(e.target.value)} placeholder="Explique o impacto, a urgência ou o contexto..." maxLength={600} /><small>{relevance.length}/600</small></label>
                <label className="question"><b>Qual é a principal mensagem que o público deve levar desta cobertura? <em>*</em></b><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Resuma a ideia central que não pode se perder..." maxLength={600} /><small>{message.length}/600</small></label>
              </section>

              <section className="form-card">
                <div className="section-title"><span>4</span><div><h2>Para aprofundar</h2><p>Informe as leituras e por que cada uma importa.</p></div></div>
                <div className="stack">
                  {recommendations.map((item, index) => (
                    <div className="recommendation" key={item.id}>
                      <div className="rec-head"><b>RECOMENDAÇÃO {index + 1}</b>{recommendations.length > 1 && <button type="button" className="remove" onClick={() => setRecommendations(recommendations.filter((rec) => rec.id !== item.id))}>Remover</button>}</div>
                      <input type="url" placeholder="Link da leitura" value={item.url} onChange={(e) => setRecommendations(recommendations.map((rec) => rec.id === item.id ? { ...rec, url: e.target.value } : rec))} />
                      <textarea placeholder="Por que esta leitura ajuda a aprofundar o tema?" value={item.reason} onChange={(e) => setRecommendations(recommendations.map((rec) => rec.id === item.id ? { ...rec, reason: e.target.value } : rec))} />
                    </div>
                  ))}
                </div>
                <button type="button" className="add" onClick={() => setRecommendations([...recommendations, { id: makeId(), url: "", reason: "" }])}>+ Adicionar recomendação</button>
              </section>

              {errors.length > 0 && <div className="error-box" role="alert"><b>Revise antes de gerar:</b><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
              <div className="submit-area">
                <p>A geração usa somente os dados desta página.</p>
                <button className="primary" disabled={processing}>{processing ? <><i /> Organizando os insumos…</> : "Gerar página →"}</button>
              </div>
            </form>
          </section>
        ) : draft && (
          <section className="preview-workspace">
            <div className="preview-actions">
              <button className="back" onClick={() => setStep(1)}>← Voltar aos insumos</button>
              <span>Prévia gerada nesta sessão</span>
            </div>
            <div className="draft-warning"><b>Rascunho — revisar e aprovar antes da publicação</b><span>O texto abaixo não foi publicado e pode conter insuficiências sinalizadas.</span></div>
            <article className="article-preview">
              <p className="eyebrow">PÁGINA DE APROFUNDAMENTO · PRÉVIA</p>
              <h1>{message.trim().replace(/[.!?]$/, "") || "Análise em desenvolvimento"}</h1>
              <p className="dek">Síntese de trabalho construída exclusivamente a partir dos materiais fornecidos nesta sessão.</p>
              <div className="source-strip"><b>Materiais usados</b><span>{transcriptFile?.name ?? videoFile?.name}</span><span>{cnnLinks.length} conteúdo(s) CNN</span><span>{recommendations.length} leitura(s)</span></div>
              <section><span className="section-number">01</span><h2>O que aconteceu?</h2><p>{draft.happened}</p>{quoteFor(0) ? <blockquote>{quoteFor(0)}</blockquote> : <p className="insufficient">Citação não incluída: os insumos não oferecem uma fala curta com autoria e crédito identificáveis.</p>}</section>
              <section><span className="section-number">02</span><h2>Por que isso importa?</h2><p>{draft.matters}</p>{quoteFor(1) ? <blockquote>{quoteFor(1)}</blockquote> : <p className="insufficient">Não há outra citação válida e atribuída disponível sem repetir autor ou inventar crédito.</p>}</section>
              <section><span className="section-number">03</span><h2>O que observar daqui em diante?</h2><p>{draft.watch}</p>{quoteFor(2) ? <blockquote>{quoteFor(2)}</blockquote> : <p className="insufficient">Os materiais não permitem incluir uma terceira citação válida com segurança.</p>}</section>
              <section><span className="section-number">04</span><h2>Para aprofundar o tema</h2><div className="reading-list">{recommendations.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer"><span>{new URL(item.url).hostname.replace(/^www\./, "")}</span><b>{item.reason}</b><small>Abrir leitura ↗</small></a>)}</div></section>
            </article>
            <div className="approval-footer"><div><b>Próximo passo: revisão editorial humana</b><p>Confira fatos, contexto, atribuições e aderência antes de levar o conteúdo a qualquer CMS.</p></div><button onClick={() => setStep(1)}>Editar insumos</button></div>
          </section>
        )}
      </div>
    </main>
  );
}
