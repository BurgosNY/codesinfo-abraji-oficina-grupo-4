window.HISTORY = {
  group: 4,
  dateLabel: "31 de julho de 2026",
  collectedLabel: "17 de agosto de 2026",
  phases: {
    abertura: "Conversas iniciais",
    ww: "Produto editorial WW",
    revisao: "Revisão do produto WW",
    entrega: "Publicação do produto WW",
    newsletter: "Thread: newsletter de ciência cidadã",
  },
  decisions: [
    "O produto WW é uma ferramenta interna para transformar insumos autorizados da redação em uma prévia editorial estruturada.",
    "O texto usa exatamente quatro seções: O que aconteceu, Por que importa, O que observar e Para aprofundar.",
    "A IA trabalha somente com materiais enviados pela redação, sem fontes externas nem publicação automática.",
    "Cada seção deve incorporar citações com autoria ou crédito, e o resultado permanece sujeito à revisão do editor.",
    "A segunda versão passou a aceitar MP3, MPEG e links públicos, gerar transcrição com timecode, sugerir clipes e exportar dois PDFs.",
    "Uma newsletter de ciência cidadã foi definida em thread como projeto separado, alimentado por arquivo HTML do Google Alerts.",
    "O segundo projeto chegou a BRIEF_READY, mas ainda aguardava liberação e não foi implementado.",
  ],
  status: {
    title: "SITE PUBLICADO + NOVO BRIEF PENDENTE",
    text: "O WW Oficina Editorial foi publicado na versão a3a971ff. A newsletter de ciência cidadã permaneceu como projeto separado em BRIEF_READY, aguardando aprovação do facilitador.",
  },
  messages: [
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Pedro Burgos", time: "07:02:35", datetime: "2026-07-31T07:02:35-03:00",
      body: "@Oficina Codex teste de roteamento. Responda somente: grupo-4 pronto.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785492155411999",
    },
    {
      phase: "abertura", kind: "conversa", role: "app", author: "Oficina Codex", time: "07:02:42", datetime: "2026-07-31T07:02:42-03:00", edited: true,
      body: "grupo-4 pronto.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785492162249999",
    },
    {
      phase: "abertura", kind: "status", role: "sistema", author: "Sistema da oficina", time: "11:25:02", datetime: "2026-07-31T11:25:02-03:00",
      body: "Pedro Burgos tornou o canal público. Qualquer membro do workspace pode vê-lo e entrar nele.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785507902751179",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Daniela", time: "11:32:00", datetime: "2026-07-31T11:32:00-03:00",
      body: "oi",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508320582369",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "alvaromontoyajlm", time: "11:32:30", datetime: "2026-07-31T11:32:30-03:00",
      body: "Holaa",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508350488509",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "matheus", time: "11:32:44", datetime: "2026-07-31T11:32:44-03:00",
      body: "Olá, equipe!",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508364301709",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "hnrque.sales", time: "11:33:10", datetime: "2026-07-31T11:33:10-03:00",
      body: "Opa",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508390210779",
    },
    {
      phase: "ww", kind: "projeto", role: "pessoa", author: "matheus", time: "11:33:30", datetime: "2026-07-31T11:33:30-03:00",
      body: "@Oficina Codex quero criar um app",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508410090359",
    },
    {
      phase: "ww", kind: "projeto", role: "app", author: "Oficina Codex", time: "11:33:37", datetime: "2026-07-31T11:33:37-03:00", edited: true,
      body: "Vamos fechar um MVP pequeno. Qual problema o app deve resolver, quem vai usá-lo e qual ação principal a pessoa precisa conseguir realizar?",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508417368869",
    },
    {
      phase: "ww", kind: "projeto", role: "pessoa", author: "hnrque.sales", time: "11:39:46", datetime: "2026-07-31T11:39:46-03:00",
      body: `Queremos um assistente editorial para o WW, da CNN Brasil. A ferramenta deve transformar um bloco de análise do programa em uma página estruturada de aprofundamento, usando somente insumos fornecidos pela redação: transcrição ou vídeo, reportagens selecionadas do ecossistema CNN, respostas do editor e leituras recomendadas.

O resultado deve ter exatamente quatro seções: “O que aconteceu?”, “Por que isso importa?”, “O que observar daqui em diante?” e “Para aprofundar o tema”. O texto integra análise, contexto, bastidores e projeções; não deve parecer uma transcrição. Cada seção deve trazer ao menos uma citação curta, sempre com autor ou crédito, e ao menos uma fala direta de cada autor presente nos insumos.

A IA não pode inventar informações nem buscar fontes externas. A saída é um rascunho sujeito à revisão e aprovação do editor.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785508786500719",
    },
    {
      phase: "ww", kind: "projeto", role: "pessoa", author: "hnrque.sales", time: "11:50:55", datetime: "2026-07-31T11:50:55-03:00",
      body: `A aplicação web interna do WW deve ter um formulário para enviar transcrição, texto ou documento; um vídeo opcional; vários links de matérias do ecossistema CNN; respostas obrigatórias sobre relevância e mensagem principal; e recomendações de leitura. Um botão “Gerar página” produz a prévia.

A IA deve usar apenas esses insumos, manter exatamente as quatro seções definidas, inserir citações com crédito e indicar que o texto é um rascunho. A interface deve ser limpa, responsiva e adequada à rotina da redação.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785509455544629",
    },
    {
      phase: "ww", kind: "status", role: "app", author: "Oficina Codex", time: "11:52:13", datetime: "2026-07-31T11:52:13-03:00", edited: true,
      body: "Brief consolidado como BRIEF_READY. O escopo descreve a ferramenta editorial interna, seus insumos autorizados, as quatro seções obrigatórias e a revisão humana. Aguardamos a aprovação do facilitador.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785509533323229",
    },
    {
      phase: "ww", kind: "status", role: "app", author: "Oficina Codex", time: "11:58:47", datetime: "2026-07-31T11:58:47-03:00",
      body: "O facilitador aprovou o brief 0032bd0d. A primeira versão entrou em construção.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785509927164529",
    },
    {
      phase: "ww", kind: "status", role: "app", author: "Oficina Codex", time: "12:22:14", datetime: "2026-07-31T12:22:14-03:00",
      body: `SITE PUBLICADO — https://codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site

Esta é a versão 0032bd0d. Enviem as revisões neste canal.

WW Oficina Editorial — Protótipo
De insumos autorizados a uma prévia editorial estruturada, sem publicação automática.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511334278119",
    },
    {
      phase: "revisao", kind: "projeto", role: "pessoa", author: "hnrque.sales", time: "12:33:52", datetime: "2026-07-31T12:33:52-03:00",
      body: `@Oficina Codex precisamos revisar o produto. Ele deve aceitar arquivos .MP3 e .MPEG, além de links públicos de áudio ou vídeo, como YouTube e Drive. Remova a opção de enviar uma transcrição manual.

O produto deve entregar uma transcrição com timecode e indicar trechos de até um minuto que possam virar cortes para redes sociais. Tanto a transcrição quanto o rascunho editorial precisam ser exportáveis como dois arquivos PDF separados.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512032441169",
    },
    {
      phase: "revisao", kind: "status", role: "app", author: "Oficina Codex", time: "12:34:54", datetime: "2026-07-31T12:34:54-03:00", edited: true,
      body: "Revisão registrada: entrada por MP3, MPEG ou link público; remoção do envio manual de transcrição; transcrição com timecode; sugestões de clipes de até um minuto; e exportação separada da transcrição e do rascunho em PDF. A revisão entrou na fila.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512094904699",
    },
    {
      phase: "revisao", kind: "status", role: "sistema", author: "Sistema da oficina", time: "12:38:05", datetime: "2026-07-31T12:38:05-03:00",
      body: "ATUALIZAÇÃO — a revisão continua na fila de construção e publicação. Não é necessário reenviar o pedido.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512285823509",
    },
    {
      phase: "revisao", kind: "status", role: "sistema", author: "Sistema da oficina", time: "12:38:06", datetime: "2026-07-31T12:38:06-03:00",
      body: "O facilitador aprovou a revisão a3a971ff. A nova versão entrou em construção.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512286068059",
    },
    {
      phase: "revisao", kind: "status", role: "app", author: "Oficina Codex", time: "12:43:14", datetime: "2026-07-31T12:43:14-03:00",
      body: "ATUALIZAÇÃO — a revisão continua na fila de construção e publicação. Não é necessário reenviar o pedido.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512594884119",
    },
    {
      phase: "revisao", kind: "status", role: "app", author: "Oficina Codex", time: "12:48:16", datetime: "2026-07-31T12:48:16-03:00",
      body: "ATUALIZAÇÃO — a revisão continua na fila de construção e publicação. Não é necessário reenviar o pedido.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512896214959",
    },
    {
      phase: "entrega", kind: "status", role: "sistema", author: "Sistema da oficina", time: "12:51:41", datetime: "2026-07-31T12:51:41-03:00",
      body: `SITE PUBLICADO — https://codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site

Esta é a versão a3a971ff. Enviem as revisões neste canal.

WW Oficina Editorial — Protótipo
De insumos autorizados a uma prévia editorial estruturada, sem publicação automática.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785513101907339",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:20:09", datetime: "2026-07-31T12:20:09-03:00", thread: true,
      body: "@Oficina Codex quero criar um app",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511209951959?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:25:05", datetime: "2026-07-31T12:25:05-03:00", thread: true,
      body: "@Oficina Codex quero fazer uma ferramenta para resumir os links do Google Alerts que recebo em meu e-mail em busca de iniciativas, ferramentas, projetos e eventos de ciência cidadã.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511505498569?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "app", author: "Oficina Codex", time: "12:25:18", datetime: "2026-07-31T12:25:18-03:00", thread: true,
      body: "Entendi. Podemos começar sem integração com e-mail: o usuário fornece os links e recebe resumo, categoria, local, data e fonte. Precisamos decidir se a saída será lista, newsletter ou planilha; quais informações são indispensáveis; e se links em outros idiomas devem ser resumidos em português.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511518958939?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:29:06", datetime: "2026-07-31T12:29:06-03:00", edited: true, thread: true,
      body: "@Oficina Codex O input pode ser uma página HTML com os links?",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511746017349?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "app", author: "Oficina Codex", time: "12:29:36", datetime: "2026-07-31T12:29:36-03:00", thread: true,
      body: "Sim. A ferramenta pode extrair, deduplicar e analisar os links de uma página HTML pública ou de um arquivo HTML enviado pelo usuário. O arquivo salvo ou exportado é a opção mais simples para o MVP.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511776483559?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:29:51", datetime: "2026-07-31T12:29:51-03:00", edited: true, thread: true,
      body: "@Oficina Codex arquivo HTML enviado pelo usuário",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511791264499?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "app", author: "Oficina Codex", time: "12:30:25", datetime: "2026-07-31T12:30:25-03:00", thread: true,
      body: "MVP definido com upload do HTML exportado. A proposta inicial de saída inclui título, resumo, categoria, local, data, fonte, link e relevância, com opção de CSV. Conteúdos em qualquer idioma serão apresentados em português e classificados como iniciativa, ferramenta, projeto, evento ou não relevante.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511825773189?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:32:51", datetime: "2026-07-31T12:32:51-03:00", thread: true,
      body: "O resultado deve ser uma newsletter. As categorias indispensáveis incluem iniciativa, projeto, ferramenta, evento, trabalho científico e política pública ou ação de governo; a ferramenta também pode sugerir outras. Links em qualquer idioma devem ser apresentados em português.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785511971737859?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "status", role: "app", author: "Oficina Codex", time: "12:33:24", datetime: "2026-07-31T12:33:24-03:00", thread: true,
      body: "Já havia um MVP do grupo 4 aprovado e publicado. Para não sobrescrevê-lo, era necessário confirmar se a newsletter substituiria aquele projeto ou seria tratada como um produto separado.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512004553579?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "projeto", role: "pessoa", author: "matheus", time: "12:33:47", datetime: "2026-07-31T12:33:47-03:00", thread: true,
      body: "@Oficina Codex trate como um novo projeto separado",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512027918969?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "status", role: "app", author: "Oficina Codex", time: "12:34:36", datetime: "2026-07-31T12:34:36-03:00", thread: true,
      body: "O novo projeto separado, Newsletter de ciência cidadã, foi consolidado como BRIEF_READY. A construção e a publicação permaneceram desativadas até a aprovação do facilitador.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785512076276789?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
    {
      phase: "newsletter", kind: "conversa", role: "pessoa", author: "matheus", time: "14:37:12", datetime: "2026-07-31T14:37:12-03:00", thread: true,
      body: "@Pedro Burgos oi Pedro, consegue liberar esse MVP por favor?",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8WFCSZ/p1785519432051339?thread_ts=1785508410.090359&cid=C0BLZ8WFCSZ",
    },
  ],
};
