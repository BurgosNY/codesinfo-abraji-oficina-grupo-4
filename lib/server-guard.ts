const PRIVATE_IPV4 = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

export function requireAuthenticatedUser(request: Request) {
  const hostname = new URL(request.url).hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (!isLocal && !request.headers.get("oai-authenticated-user-id")) {
    return Response.json(
      { error: "Faça login para usar a ferramenta editorial." },
      { status: 401 },
    );
  }
  return null;
}

export function validatedPublicUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Use um endereço HTTP ou HTTPS.");
  if (url.username || url.password) throw new Error("O endereço não pode conter credenciais.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("O endereço usa uma porta não permitida.");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "::1" || PRIVATE_IPV4.test(host)) {
    throw new Error("Use um endereço público acessível pela internet.");
  }
  return url;
}
