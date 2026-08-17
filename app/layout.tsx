import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { requireChatGPTUser } from "./chatgpt-auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codesinfo-abraji-oficina-grupo-4.burgos.chatgpt.site"),
  title: "WW Oficina Editorial — Do bloco ao rascunho",
  description: "Ferramenta editorial interna para transcrever blocos do WW, revisar créditos e gerar páginas de aprofundamento com origem verificável.",
  openGraph: {
    title: "WW Oficina Editorial — Do bloco ao rascunho",
    description: "Transcrição real, revisão editorial, sugestões de cortes, prévia estruturada e dois PDFs — sem publicação automática.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const hostname = (requestHeaders.get("host") ?? "").split(":")[0];
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (!isLocal) await requireChatGPTUser("/");

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
