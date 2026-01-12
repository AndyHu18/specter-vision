import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specter Vision | 黑科技影像分析",
  description: "啟發式動態發現引擎 - 揭露人類認知盲區的 AI 影像分析系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* 終端機掃描線 */}
        <div className="terminal-scanline" />

        {children}
      </body>
    </html>
  );
}
