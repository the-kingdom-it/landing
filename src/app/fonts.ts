import { Caveat, Instrument_Serif, Inter, JetBrains_Mono, Unbounded } from "next/font/google";

/*
 * Шрифты Google Fonts через next/font (файлы скачиваются при сборке и отдаются с вашего домена).
 * Чтобы сменить шрифт: импортируй другой из next/font/google, оставь то же имя variable —
 * роли шрифтов (display / sans / mono) назначаются в globals.css.
 */
export const displayFont = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  variable: "--font-unbounded",
  display: "swap",
});

export const sansFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/* Шрифты для вариантов выделения в заголовке (?title=5 и ?title=6). Без предзагрузки — грузятся, только если нужны. */
export const scriptFont = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const serifFont = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
  scriptFont.variable,
  serifFont.variable,
].join(" ");
