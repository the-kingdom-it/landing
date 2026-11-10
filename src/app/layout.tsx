import type { ReactNode } from "react";
import { content } from "@/content";
import { buildMetadata } from "@/lib/metadata";
import { buildSeasonScript, resolveSeason } from "@/lib/season";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata = buildMetadata(content.meta);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-season уточняет скрипт в <head> до отрисовки, поэтому расхождение с сервером ожидаемо
    <html
      lang="ru"
      className={fontVariables}
      data-season={resolveSeason(content.scene.season, new Date())}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildSeasonScript(content.scene.season) }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
