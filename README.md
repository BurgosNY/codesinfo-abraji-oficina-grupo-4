# WW Oficina Editorial

Protótipo do Grupo 4 da oficina de construção com IA do Hackaton Codesinfo, realizado no 21º Congresso da Abraji.

A aplicação demonstra um fluxo editorial para transformar um bloco audiovisual e orientações da redação em uma prévia estruturada de aprofundamento. O resultado inclui transcrição com timecodes, sugestões de trechos para redes sociais, rascunho em quatro seções e dois PDFs separados.

## O que o protótipo faz

- aceita a seleção de um arquivo de áudio ou vídeo, ou de um link público;
- valida formatos e alerta sobre endereços que parecem exigir autenticação;
- recebe links de conteúdos CNN, orientação editorial e leituras recomendadas;
- simula transcrição, marcação de timecodes e seleção de clipes de até um minuto;
- organiza o rascunho em quatro seções editoriais obrigatórias;
- gera um PDF do rascunho e outro com transcrição e sugestões de trechos;
- mantém a entrega como rascunho sujeito à revisão, sem publicação automática.

## Estado atual

O processamento é demonstrativo. O protótipo não envia, escuta nem transcreve a mídia escolhida; nomes, citações, timecodes e sugestões de clipes vêm de uma amostra fictícia incorporada à interface. Não há armazenamento, CMS ou autenticação.

- [Abrir a demonstração](https://codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site)
- [Ler o registro das interações no Slack](public/historico-interacoes.html)

## Como rodar localmente

### Pré-requisitos

- Node.js 22.13 ou mais recente;
- npm.

### Instalação e desenvolvimento

```bash
npm ci
npm run dev
```

Abra no navegador o endereço informado pelo terminal.

### Validação e execução de produção

```bash
npm test
npm run build
npm run start
```

O fluxo principal está em `app/page.tsx`; a geração dos PDFs usa `jsPDF` no navegador.

## Roadmap possível

- [ ] Implementar upload seguro e processamento real de áudio e vídeo.
- [ ] Transcrever com timecodes, identificação de falantes e revisão manual.
- [ ] Extrair somente conteúdos autorizados dos links fornecidos pela redação.
- [ ] Gerar o rascunho com IA restrita aos materiais enviados e citações rastreáveis.
- [ ] Permitir ajustar trechos, falas, títulos e as quatro seções antes da exportação.
- [ ] Versionar rascunhos e registrar quem revisou, aprovou ou solicitou alterações.
- [ ] Integrar autenticação, política de retenção e exclusão segura dos arquivos.
- [ ] Conectar ao CMS apenas depois de uma aprovação editorial explícita.
- [ ] Ampliar testes de formatos, arquivos grandes, links indisponíveis e acessibilidade.

## Princípios editoriais e de segurança

- A IA deve trabalhar somente com os insumos autorizados pela redação.
- Citações precisam preservar autoria, contexto e origem verificável.
- Nenhum conteúdo deve ser publicado automaticamente.
- Arquivos e transcrições exigem acesso controlado, retenção mínima e trilha de auditoria.
