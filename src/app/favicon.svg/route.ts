import { readFileSync } from "node:fs";
import { join } from "node:path";
import { content } from "@/content";
import { readCssVar } from "@/lib/css";
import { buildFaviconSvg } from "@/lib/favicon";

// Файл /favicon.svg генерируется при сборке: инициалы из content.ts, цвет — --accent из globals.css
export const dynamic = "force-static";

export function GET() {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  const accent = readCssVar(css, "--accent");
  if (!accent) {
    throw new Error("favicon: в src/app/globals.css не найдена переменная --accent");
  }
  return new Response(buildFaviconSvg(content.brand.initials, accent), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
