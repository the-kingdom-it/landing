import type { ReactNode } from "react";
import { content } from "@/content";
import { buildMetadata } from "@/lib/metadata";
import { BACKGROUNDS, buildBackgroundScript, resolveScene, type SceneConfig } from "@/lib/backgrounds";
import { BASE_PATH } from "@/lib/base-path";
import { sceneStyles } from "@/lib/scene";
import { buildSeasonScript, resolveSeason } from "@/lib/season";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata = buildMetadata(content.meta);

export default function RootLayout({ children }: { children: ReactNode }) {
  // BG=3 npm run dev — показать фон 3 (как ?bg=3), THEME=dark npm run dev — тёмная тема по умолчанию
  const forcedBg = BACKGROUNDS.find((bg) => bg.id === process.env.BG)?.id ?? null;
  const theme = process.env.THEME === "dark" || process.env.THEME === "light" ? process.env.THEME : content.scene.theme;
  const sceneConfig: SceneConfig = { theme, background: content.scene.background, forcedBg };
  const scene = resolveScene(sceneConfig, {});
  return (
    // data-season уточняет скрипт в <head> до отрисовки, поэтому расхождение с сервером ожидаемо
    <html
      lang="ru"
      className={fontVariables}
      data-season={resolveSeason(content.scene.season, new Date())}
      data-bg={scene.bg}
      data-theme={scene.theme}
      data-preview={scene.preview ? "" : undefined}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildSeasonScript(content.scene.season) }} />
        <script dangerouslySetInnerHTML={{ __html: buildBackgroundScript(sceneConfig) }} />
        <style dangerouslySetInnerHTML={{ __html: sceneStyles(BASE_PATH) }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
