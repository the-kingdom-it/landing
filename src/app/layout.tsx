import type { ReactNode } from "react";
import { content } from "@/content";
import { buildMetadata } from "@/lib/metadata";
import { buildBackgroundScript, resolveBackground } from "@/lib/backgrounds";
import { BASE_PATH } from "@/lib/base-path";
import { sceneStyles } from "@/lib/scene";
import { buildSeasonScript, resolveSeason } from "@/lib/season";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata = buildMetadata(content.meta);

export default function RootLayout({ children }: { children: ReactNode }) {
  // BG=3 npm run dev — временно сменить фон по умолчанию без правки content.ts
  const background = resolveBackground(process.env.BG ?? content.scene.background);
  return (
    // data-season уточняет скрипт в <head> до отрисовки, поэтому расхождение с сервером ожидаемо
    <html
      lang="ru"
      className={fontVariables}
      data-season={resolveSeason(content.scene.season, new Date())}
      data-bg={background}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildSeasonScript(content.scene.season) }} />
        <script dangerouslySetInnerHTML={{ __html: buildBackgroundScript(background) }} />
        <style dangerouslySetInnerHTML={{ __html: sceneStyles(BASE_PATH) }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
