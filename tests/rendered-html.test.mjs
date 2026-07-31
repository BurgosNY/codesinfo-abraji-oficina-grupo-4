import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the functional editorial intake", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /WW Oficina Editorial/);
  assert.match(html, /Transforme análise em uma primeira versão estruturada/);
  assert.match(html, /Enviar transcrição/);
  assert.match(html, /Enviar trecho em vídeo/);
  assert.match(html, /Por que este tema é relevante/);
  assert.match(html, /Qual é a principal mensagem/);
  assert.match(html, /Gerar página/);
  assert.match(html, /Nada é publicado/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});
