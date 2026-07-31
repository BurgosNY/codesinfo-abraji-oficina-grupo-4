import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Protótipo audiovisual com material de origem, processamento demonstrativo, transcrição com timecodes, prévia editorial e dois PDFs.",
  openGraph: {
    title: "WW Oficina Editorial — Do bloco ao rascunho",
    description: "Áudio ou vídeo, transcrição demonstrativa, trechos sociais, prévia e dois PDFs — sem publicação automática.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
