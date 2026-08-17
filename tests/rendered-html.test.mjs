import assert from "node:assert/strict";
import test from "node:test";

async function run(request) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(request, { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the functional editorial workflow", async () => {
  const response = await run(new Request("https://ww.example/", {
    headers: {
      accept: "text/html",
      "oai-authenticated-user-id": "test-user",
      "oai-authenticated-user-email": "editor@example.com",
    },
  }));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Do bloco ao rascunho, com origem verificável/);
  assert.match(html, /PROCESSAMENTO REAL/);
  assert.match(html, /Transcrever material/);
  assert.match(html, /MP3, MPEG/);
  assert.match(html, /Por que este tema é relevante/);
  assert.match(html, /Qual é a principal mensagem/);
  assert.doesNotMatch(html, /DEMONSTRAÇÃO PÚBLICA|CONTEÚDO SIMULADO|setTimeout/);
});

test("redirects anonymous visitors to ChatGPT sign-in", async () => {
  const response = await run(new Request("https://ww.example/", { headers: { accept: "text/html" } }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://ww.example/signin-with-chatgpt?return_to=%2F");
});

test("exposes server-side validation for the transcription route", async () => {
  const form = new FormData();
  const response = await run(new Request("http://localhost/api/transcribe", { method: "POST", body: form }));
  assert.equal(response.status, 422);
  const payload = await response.json();
  assert.match(payload.error, /Envie um arquivo ou informe um link público/);
});

test("exposes server-side validation for the generation route", async () => {
  const response = await run(new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  }));
  assert.equal(response.status, 422);
  const payload = await response.json();
  assert.match(payload.error, /transcrição/);
});
