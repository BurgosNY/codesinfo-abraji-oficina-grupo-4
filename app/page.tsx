"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type LinkRow = { id: number; url: string };
type Reading = { id: number; url: string; reason: string };
type SourceMode = "file" | "link";

const sampleTranscript = [
  { time: "00:00", speaker: "Helena Duarte, analista de política", text: "O dado isolado chama atenção, mas a série histórica muda a leitura do resultado." },
  { time: "00:18", speaker: "Marcos Vieira, economista", text: "A principal questão agora é saber se o movimento se mantém nos próximos meses." },
  { time: "00:44", speaker: "Lia Ramos, apresentadora", text: "O público precisa distinguir uma variação pontual de uma mudança de tendência." },
  { time: "01:08", speaker: "Helena Duarte, analista de política", text: "Há decisões em curso que ainda podem alterar o cenário apresentado no bloco." },
  { time: "01:34", speaker: "Marcos Vieira, economista", text: "Sem a abertura dos componentes, uma conclusão definitiva seria prematura." },
  { time: "02:02", speaker: "Lia Ramos, apresentadora", text: "A equipe seguirá acompanhando os próximos indicadores e seus efeitos concretos." },
];

const clips = [
  { start: "00:14", end: "00:54", duration: "00:40", title: "O número e a tendência", reason: "Contrapõe o dado isolado à leitura histórica e termina com uma pergunta clara." },
  { start: "01:04", end: "01:49", duration: "00:45", title: "Por que ainda é cedo para concluir", reason: "Reúne cautela analítica e os fatores capazes de mudar o cenário." },
];

const nextId = () => Date.now() + Math.floor(Math.random() * 999);
function validUrl(value: string) { try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url : null; } catch { return null; } }
function suspiciousPrivateLink(value: string) { const lower = value.toLowerCase(); return /login|signin|authuser|accounts\.google/.test(lower) || (lower.includes("drive.google.com") && !/sharing|open\?id=/.test(lower)); }
function pdfText(value: string) { return value.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/…/g, "..."); }

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<SourceMode>("file");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [cnnLinks, setCnnLinks] = useState<LinkRow[]>([{ id: 1, url: "" }]);
  const [readings, setReadings] = useState<Reading[]>([{ id: 1, url: "", reason: "" }]);
  const [relevance, setRelevance] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<"draft" | "transcript">("draft");

  const sourceLabel = mode === "file" ? mediaFile?.name : mediaUrl;

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    setMediaFile(event.target.files?.[0] ?? null);
    setMediaUrl("");
  }

  function fillDemo() {
    setMode("link"); setMediaFile(null); setMediaUrl("https://www.youtube.com/watch?v=material-publico-demonstrativo");
    setCnnLinks([{ id: 1, url: "https://www.cnnbrasil.com.br/politica/" }, { id: 2, url: "https://www.cnnbrasil.com.br/economia/" }]);
    setRelevance("O tema afeta decisões públicas e precisa ser explicado sem transformar uma variação isolada em tendência consolidada.");
    setMessage("O público deve compreender o que o dado permite afirmar agora, quais lacunas permanecem e o que acompanhar nos próximos meses.");
    setReadings([{ id: 1, url: "https://www.cnnbrasil.com.br/economia/", reason: "Contextualiza a série histórica citada no bloco e ajuda a separar tendência de oscilação." }]);
    setErrors([]);
  }

  function validate() {
    const next: string[] = [];
    if (mode === "file" && !mediaFile) next.push("Envie um arquivo de áudio ou vídeo.");
    if (mode === "file" && mediaFile && !(/^(audio|video)\//.test(mediaFile.type) || /\.(mp3|mpeg|mp4|mov|m4a|wav|webm)$/i.test(mediaFile.name))) next.push("Formato não aceito. Use áudio ou vídeo, incluindo .mp3 e .mpeg.");
    if (mode === "link" && !validUrl(mediaUrl)) next.push("Informe um link público válido de áudio ou vídeo.");
    if (mode === "link" && validUrl(mediaUrl) && suspiciousPrivateLink(mediaUrl)) next.push("Esse endereço parece exigir login ou permissão. Use um link aberto para qualquer pessoa.");
    if (!cnnLinks.length || cnnLinks.some((item) => !validUrl(item.url))) next.push("Preencha ao menos um link CNN válido.");
    if (relevance.trim().length < 20) next.push("Explique a relevância com pelo menos 20 caracteres.");
    if (message.trim().length < 20) next.push("Defina a mensagem principal com pelo menos 20 caracteres.");
    if (!readings.length || readings.some((item) => !validUrl(item.url) || item.reason.trim().length < 12)) next.push("Cada recomendação precisa de link válido e justificativa com pelo menos 12 caracteres.");
    setErrors(next); return next.length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); if (!validate()) return;
    setStep(2); setProgress(1); window.scrollTo({ top: 0, behavior: "smooth" });
    for (const state of [2, 3, 4]) { await new Promise((resolve) => setTimeout(resolve, 650)); setProgress(state); }
    setStep(3); setView("draft");
  }

  async function downloadDraftPdf() {
    const { jsPDF } = await import("jspdf"); const doc = new jsPDF({ unit: "mm", format: "a4" }); let y = 18;
    doc.setFillColor(17, 27, 45); doc.rect(0, 0, 210, 31, "F"); doc.setTextColor(255); doc.setFontSize(18); doc.text("WW Oficina Editorial", 16, 16); doc.setFontSize(9); doc.text("RASCUNHO - REVISAR E APROVAR ANTES DA PUBLICACAO", 16, 24); doc.setTextColor(25); y = 43;
    const sections = [
      ["1. O que aconteceu?", "O bloco apresentou uma variacao relevante no indicador acompanhado e destacou que o resultado isolado precisa ser lido em conjunto com a serie historica. A transcricao demonstrativa indica cautela antes de tratar o movimento como tendencia."],
      ["2. Por que isso importa?", relevance],
      ["3. O que observar daqui em diante?", message],
      ["4. Para aprofundar o tema", readings.map((item) => `${item.reason}\n${item.url}`).join("\n\n")],
    ];
    for (const [title, body] of sections) { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(pdfText(title), 16, y); y += 8; doc.setFont("helvetica", "normal"); doc.setFontSize(10); const lines = doc.splitTextToSize(pdfText(body), 176); if (y + lines.length * 5 > 275) { doc.addPage(); y = 20; } doc.text(lines, 16, y); y += lines.length * 5 + 11; }
    doc.setFontSize(8); doc.setTextColor(100); doc.text("Prototipo demonstrativo - nenhum conteudo foi publicado automaticamente.", 16, 288); doc.save("ww-rascunho-editorial.pdf");
  }

  async function downloadTranscriptPdf() {
    const { jsPDF } = await import("jspdf"); const doc = new jsPDF({ unit: "mm", format: "a4" }); let y = 18;
    doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("WW - Transcricao demonstrativa", 16, y); y += 8; doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(115); doc.text("SIMULACAO: o prototipo nao ouviu nem transcreveu o arquivo ou link enviado.", 16, y); y += 13; doc.setTextColor(25);
    for (const item of sampleTranscript) { doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(`${item.time}  ${pdfText(item.speaker)}`, 16, y); y += 5; doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(pdfText(item.text), 176); doc.text(lines, 16, y); y += lines.length * 5 + 7; }
    y += 4; doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text("Trechos sugeridos para redes sociais", 16, y); y += 8;
    for (const clip of clips) { doc.setFontSize(10); doc.text(`${clip.start} - ${clip.end} (${clip.duration}) | ${pdfText(clip.title)}`, 16, y); y += 5; doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(pdfText(clip.reason), 176); doc.text(lines, 16, y); y += lines.length * 5 + 7; doc.setFont("helvetica", "bold"); }
    doc.save("ww-transcricao-e-trechos.pdf");
  }

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">WW</span><span>OFICINA EDITORIAL</span></a><span className="prototype">PROTÓTIPO · CONTEÚDO SIMULADO</span></header>
    <div className="demo-alert"><b>DEMONSTRAÇÃO PÚBLICA</b><span>O protótipo não acessa nem escuta o material enviado. A transcrição, citações e timecodes são uma amostra fictícia claramente identificada.</span></div>
    <div className="shell" id="top">
      <aside className="rail" aria-label="Etapas">{[[1,"Insumos","Arquivos e orientação"],[2,"Processamento","Transcrição e trechos"],[3,"Entrega","Prévia e PDFs"]].map(([number,label,help]) => <div key={number} className={`rail-step ${step === number ? "active" : step > number ? "done" : ""}`}><span>0{number}</span><div><b>{label}</b><small>{help}</small></div></div>)}<div className="privacy-note"><b>Nada é publicado</b><p>Arquivos e respostas ficam somente nesta sessão. Não há CMS, armazenamento, busca externa ou autenticação.</p></div></aside>

      {step === 1 && <section className="workspace"><div className="intro"><p className="eyebrow">NOVA PÁGINA DE APROFUNDAMENTO</p><h1>Do bloco ao rascunho, com cada etapa visível.</h1><p>Forneça um material autorizado e as decisões editoriais. Esta versão demonstra transcrição, seleção de trechos e entrega — sem processar mídia real.</p><button className="demo-fill" onClick={fillDemo}>Preencher exemplo para testar</button></div>
        <form onSubmit={submit} noValidate>
          <section className="form-card"><div className="section-title"><span>1</span><div><h2>Material de origem</h2><p>Áudio, vídeo ou link público — nunca uma transcrição pronta.</p></div></div><div className="mode-tabs"><button type="button" className={mode === "file" ? "active" : ""} onClick={() => setMode("file")}>Enviar arquivo</button><button type="button" className={mode === "link" ? "active" : ""} onClick={() => setMode("link")}>Usar link público</button></div>
            {mode === "file" ? <label className={`media-upload ${mediaFile ? "selected" : ""}`}><input type="file" accept="audio/*,video/*,.mp3,.mpeg,.m4a" onChange={chooseFile}/><span>ÁUDIO / VÍDEO</span><b>{mediaFile?.name ?? "Escolha um arquivo"}</b><small>MP3, MPEG, MP4, MOV, M4A, WAV ou WebM</small></label> : <label className="public-link"><b>LINK ABERTO DO MATERIAL</b><input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://youtube.com/... ou link público do Drive"/><small>Endereços que indiquem login ou permissão serão recusados.</small></label>}
          </section>
          <section className="form-card"><div className="section-title"><span>2</span><div><h2>Conteúdos CNN selecionados</h2><p>Adicione ou remova os links escolhidos pela redação.</p></div></div><div className="stack">{cnnLinks.map((item,index)=><div className="row" key={item.id}><label><small>LINK {index+1}</small><input value={item.url} onChange={(e)=>setCnnLinks(cnnLinks.map((link)=>link.id===item.id?{...link,url:e.target.value}:link))} placeholder="https://www.cnnbrasil.com.br/..."/></label>{cnnLinks.length>1&&<button type="button" className="remove" onClick={()=>setCnnLinks(cnnLinks.filter((link)=>link.id!==item.id))}>Remover</button>}</div>)}</div><button type="button" className="add" onClick={()=>setCnnLinks([...cnnLinks,{id:nextId(),url:""}])}>+ Adicionar conteúdo</button></section>
          <section className="form-card"><div className="section-title"><span>3</span><div><h2>Orientação editorial</h2><p>As duas respostas são obrigatórias.</p></div></div><label className="question"><b>Por que este tema é relevante para o público? *</b><textarea value={relevance} onChange={(e)=>setRelevance(e.target.value)} maxLength={600}/><small>{relevance.length}/600</small></label><label className="question"><b>Qual é a principal mensagem que o público deve levar desta cobertura? *</b><textarea value={message} onChange={(e)=>setMessage(e.target.value)} maxLength={600}/><small>{message.length}/600</small></label></section>
          <section className="form-card"><div className="section-title"><span>4</span><div><h2>Para aprofundar</h2><p>Somente estas recomendações aparecerão na quarta seção.</p></div></div>{readings.map((item,index)=><div className="recommendation" key={item.id}><div className="rec-head"><b>RECOMENDAÇÃO {index+1}</b>{readings.length>1&&<button type="button" className="remove" onClick={()=>setReadings(readings.filter((reading)=>reading.id!==item.id))}>Remover</button>}</div><input value={item.url} onChange={(e)=>setReadings(readings.map((reading)=>reading.id===item.id?{...reading,url:e.target.value}:reading))} placeholder="Link da leitura"/><textarea value={item.reason} onChange={(e)=>setReadings(readings.map((reading)=>reading.id===item.id?{...reading,reason:e.target.value}:reading))} placeholder="Por que esta leitura ajuda?"/></div>)}<button type="button" className="add" onClick={()=>setReadings([...readings,{id:nextId(),url:"",reason:""}])}>+ Adicionar recomendação</button></section>
          {errors.length>0&&<div className="error-box" role="alert"><b>Revise antes de gerar:</b><ul>{errors.map((error)=><li key={error}>{error}</li>)}</ul></div>}<div className="submit-area"><p>A mídia não sai do navegador nesta demonstração.</p><button className="primary">Gerar página →</button></div>
        </form>
      </section>}

      {step === 2 && <section className="processing"><p className="eyebrow">PROCESSAMENTO DEMONSTRATIVO</p><h1>Organizando o bloco<br/>em camadas editoriais.</h1><div className="process-card">{["Validando o material público","Transcrevendo e marcando timecodes","Selecionando trechos de até 1 minuto","Estruturando a prévia e os PDFs"].map((label,index)=><div key={label} className={progress>index?"complete":progress===index?"current":""}><span>{progress>index?"✓":`0${index+1}`}</span><b>{label}</b><small>{progress>index?"Concluído":progress===index?"Em andamento…":"Aguardando"}</small></div>)}</div><p className="simulation-note">Simulação: nenhuma mídia está sendo transcrita. O resultado usa a amostra fictícia incorporada ao protótipo.</p></section>}

      {step === 3 && <section className="delivery"><div className="delivery-head"><div><p className="eyebrow">ENTREGA DA SESSÃO</p><h1>Rascunho pronto para revisão.</h1><p>Origem: {sourceLabel}</p></div><button className="back" onClick={()=>setStep(1)}>← Editar insumos</button></div><div className="draft-warning"><b>Rascunho — revisar e aprovar antes da publicação</b><span>Nenhum conteúdo foi enviado a CMS ou publicado automaticamente.</span></div><div className="download-row"><button onClick={downloadDraftPdf}><span>PDF 01</span><b>Baixar rascunho principal</b><small>Quatro seções + aviso editorial</small></button><button onClick={downloadTranscriptPdf}><span>PDF 02</span><b>Baixar transcrição e trechos</b><small>Timecodes + sugestões sociais</small></button></div><nav className="output-tabs"><button className={view==="draft"?"active":""} onClick={()=>setView("draft")}>Prévia da página</button><button className={view==="transcript"?"active":""} onClick={()=>setView("transcript")}>Transcrição e trechos</button></nav>
        {view === "draft" ? <article className="article-preview"><p className="eyebrow">PÁGINA DE APROFUNDAMENTO · PRÉVIA</p><h1>{message.replace(/[.!?]$/," ")}</h1><p className="dek">Síntese demonstrativa baseada nas orientações preenchidas e em uma transcrição fictícia do protótipo.</p><div className="source-strip"><b>Materiais usados</b><span>{cnnLinks.length} conteúdo(s) CNN</span><span>{readings.length} leitura(s)</span><span>transcrição simulada</span></div><section><span className="section-number">01</span><h2>O que aconteceu?</h2><p>O bloco apresentou uma variação relevante no indicador acompanhado e ressaltou que o dado isolado precisa ser lido junto da série histórica.</p><blockquote>“O dado isolado chama atenção, mas a série histórica muda a leitura do resultado.” — Helena Duarte, analista de política</blockquote></section><section><span className="section-number">02</span><h2>Por que isso importa?</h2><p>{relevance}</p><blockquote>“A principal questão agora é saber se o movimento se mantém nos próximos meses.” — Marcos Vieira, economista</blockquote></section><section><span className="section-number">03</span><h2>O que observar daqui em diante?</h2><p>{message}</p><blockquote>“O público precisa distinguir uma variação pontual de uma mudança de tendência.” — Lia Ramos, apresentadora</blockquote></section><section><span className="section-number">04</span><h2>Para aprofundar o tema</h2><div className="reading-list">{readings.map((item)=><a key={item.id} href={item.url} target="_blank" rel="noreferrer"><span>{validUrl(item.url)?.hostname}</span><b>{item.reason}</b><small>Abrir leitura ↗</small></a>)}</div></section></article> : <div className="transcript-view"><div className="simulation-note"><b>TRANSCRIÇÃO FICTÍCIA PARA TESTE</b> O sistema não ouviu o material informado. Os nomes, falas e timecodes abaixo são demonstrativos.</div><div className="transcript-list">{sampleTranscript.map((item)=><article key={item.time}><time>{item.time}</time><div><b>{item.speaker}</b><p>{item.text}</p></div></article>)}</div><h2>Trechos sugeridos para redes sociais</h2><div className="clip-grid">{clips.map((clip)=><article key={clip.start}><span>{clip.start} → {clip.end}</span><b>{clip.title}</b><p>{clip.reason}</p><small>Duração {clip.duration} · abaixo de 1 minuto</small></article>)}</div></div>}
      </section>}
    </div>
  </main>;
}
