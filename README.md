# WW Oficina Editorial — Grupo 4

Ferramenta interna para transformar entrevistas e blocos do WW em um rascunho editorial verificável. O fluxo recebe áudio, vídeo ou link público, transcreve o material, permite revisar participantes e créditos e gera uma página de aprofundamento baseada somente nos insumos autorizados pela redação.

Produção: [codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site](https://codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site)

## O que o produto faz

1. Recebe um arquivo de áudio ou vídeo de até 24 MB, um arquivo público no Google Drive ou um vídeo do YouTube com legendas públicas.
2. Transcreve o material e separa as falas por participante, com timecodes.
3. Permite que a redação corrija a transcrição e confirme o nome e o crédito de cada pessoa.
4. Lê de 1 a 8 conteúdos do ecossistema CNN selecionados pelo editor.
5. Usa a orientação editorial, a transcrição revisada, os conteúdos CNN e as leituras recomendadas para gerar:
   - título e subtítulo;
   - `O que aconteceu?`;
   - `Por que isso importa?`;
   - `O que observar daqui em diante?`;
   - `Para aprofundar o tema`, preservando somente as leituras escolhidas pela redação;
   - sugestões de trechos de até 60 segundos para redes sociais.
6. Exporta dois PDFs: o rascunho principal e a transcrição com timecodes e cortes sugeridos.

O sistema não publica nada automaticamente em CMS. Toda saída é apresentada como rascunho para revisão e aprovação editorial.

## Garantias editoriais

- A geração usa somente os materiais enviados naquela sessão.
- Páginas de contexto aceitas pelo backend são limitadas ao ecossistema CNN.
- Citações precisam existir literalmente na transcrição.
- Nome, crédito e timecode são reconstruídos a partir do trecho verificado, não aceitos cegamente da resposta do modelo.
- Um segundo passe de IA verifica a fundamentação factual do rascunho.
- Se o texto continuar trazendo extrapolações após a nova tentativa, a entrega é bloqueada em vez de exibir conteúdo não sustentado.
- Links remotos passam por validações de protocolo, redirecionamento, tamanho e rede privada.
- Visitantes precisam entrar com ChatGPT; as APIs também recusam requisições sem identidade autenticada.

## Tecnologias

- Next.js 16, React 19 e TypeScript
- vinext e Cloudflare Workers/Sites
- OpenAI Audio API com `gpt-4o-transcribe-diarize`
- OpenAI Responses API com saída estruturada; `gpt-5-mini` por padrão
- `youtube-transcript` para legendas públicas do YouTube
- jsPDF para os documentos exportados no navegador

## Como rodar localmente

### Pré-requisitos

- Node.js `>=22.13.0`
- Uma chave de projeto da OpenAI com acesso aos modelos usados

### Instalação

```bash
git clone https://github.com/BurgosNY/codesinfo-abraji-oficina-grupo-4.git
cd codesinfo-abraji-oficina-grupo-4
npm install
cp .env.example .env.local
```

Preencha `.env.local`:

```dotenv
OPENAI_API_KEY=sk-...
OPENAI_TEXT_MODEL=gpt-5-mini
```

Nunca faça commit da chave. Arquivos `.env*`, com exceção do `.env.example`, estão ignorados pelo Git.

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000`. Em produção, o Sites executa o login com ChatGPT e injeta os cabeçalhos de identidade; em `localhost`, o projeto libera o fluxo para desenvolvimento.

## Comandos úteis

```bash
npm run dev       # servidor local
npm run build     # build vinext de produção
npm test          # build + regressões das rotas e da interface
npm run lint      # ESLint
npm run start     # executa o build localmente
```

## Fluxo para testar

1. Envie um áudio ou vídeo compatível (`FLAC`, `MP3`, `MPEG`, `MP4`, `M4A`, `OGG`, `WAV` ou `WebM`) de até 24 MB. Como alternativa, use um link público de arquivo, Google Drive aberto ou YouTube com legendas públicas.
2. Informe ao menos um conteúdo CNN, uma leitura recomendada e as duas respostas de orientação editorial.
3. Clique em **Transcrever material**.
4. Revise os trechos, nomes e créditos reconhecidos.
5. Clique em **Gerar página**.
6. Confira a prévia, os alertas editoriais, os cortes sugeridos e os dois PDFs.

Links do Google Drive precisam estar liberados para qualquer pessoa com o link. Se um vídeo do YouTube não expuser legendas públicas, envie o arquivo de áudio ou vídeo.

## Estrutura principal

```text
app/
  api/transcribe/route.ts  # ingestão e transcrição
  api/generate/route.ts    # leitura de contexto, geração e verificação
  page.tsx                 # fluxo editorial e exportação dos PDFs
lib/
  server-guard.ts          # autenticação e validação de URLs
  ww.ts                    # contratos e utilitários do domínio
tests/                     # regressões do fluxo, rotas e utilitários
```

## Roadmap possível

As ideias abaixo são possibilidades, não compromissos fechados.

### Operação editorial

- Salvar sessões, rascunhos e histórico de revisões.
- Permitir colaboração entre repórter, produtor e editor, com comentários e estados de aprovação.
- Criar modelos de página e regras editoriais por programa ou editoria.
- Exibir a fonte de sustentação de cada frase do rascunho, com navegação até o trecho original.
- Comparar versões e registrar quem alterou transcrição, crédito ou texto.

### Ingestão e processamento

- Processar arquivos maiores de forma assíncrona, com upload direto para armazenamento e acompanhamento de progresso.
- Extrair o áudio de vídeos do YouTube quando não houver legenda pública e houver autorização para uso.
- Aceitar mais fontes editoriais por meio de uma allowlist administrável.
- Detectar automaticamente nomes prováveis, temas, entidades e capítulos do material.
- Reaproveitar uma mesma transcrição em diferentes formatos de entrega.

### Entrega e integração

- Exportar para DOCX, Google Docs e JSON estruturado.
- Integrar com o CMS da redação usando uma etapa explícita de aprovação humana.
- Gerar cards, legendas e formatos sociais a partir dos cortes aprovados.
- Criar uma área de busca por entrevistas, participantes e assuntos anteriores.
- Adicionar notificações quando transcrições longas ou gerações assíncronas terminarem.

### Administração e qualidade

- Painel de uso, custo, latência e taxa de bloqueio por falta de fundamentação.
- Allowlist de usuários e papéis editoriais por equipe.
- Fila de reprocessamento e observabilidade das chamadas externas.
- Avaliações editoriais contínuas para medir fidelidade, cobertura, diversidade de citações e utilidade dos cortes.
- Testes de navegador cobrindo login, upload, revisão, geração e download em produção.

## Limitações atuais

- O estado da sessão vive no navegador e não é persistido no servidor.
- O limite por arquivo é 24 MB.
- YouTube depende de legendas públicas acessíveis.
- O contexto jornalístico externo está restrito aos domínios CNN permitidos.
- Não há integração direta com CMS nem publicação automática.
- A ferramenta auxilia o trabalho editorial, mas não substitui revisão, checagem e aprovação humanas.
