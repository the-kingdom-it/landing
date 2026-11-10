import { BACKGROUNDS } from "./backgrounds";
import { withBasePath } from "./base-path";
import { SEASONS } from "./season";

/** Мягкое затемнение для минималистичных фонов в «своей» теме: им не нужно сильное, как пёстрой сцене. */
const SOFT_OVERLAY = {
  dark: "linear-gradient(180deg,rgba(8,10,18,.08) 0%,rgba(8,10,18,.28) 100%)",
  light: "linear-gradient(180deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.22) 100%)",
};

/**
 * CSS с картинками сцены для каждого сезона (десктоп и портретный кроп для телефонов)
 * и минималистичными фонами. Собирается в коде, а не в globals.css, чтобы к путям добавлялся
 * базовый путь сайта, а затемнение подстраивалось под каждый фон.
 */
export function sceneStyles(base: string): string {
  const rule = (season: string, file: string) =>
    `html[data-season="${season}"]{--scene-image:url("${withBasePath(`/scene/${file}.webp`, base)}")}`;
  const desktop = SEASONS.map((season) => rule(season, season)).join("");
  const mobile = SEASONS.map((season) => rule(season, `${season}-m`)).join("");
  // минималистичные фоны идут последними, чтобы перекрыть сезонную картинку и на телефонах
  const backgrounds = BACKGROUNDS.filter((bg) => bg.id !== "kingdom")
    .map((bg) => `html[data-bg="${bg.id}"]{--scene-image:url("${withBasePath(`/backgrounds/${bg.id}.webp`, base)}")}`)
    .join("");
  const overlays = BACKGROUNDS.filter((bg) => bg.id !== "kingdom")
    .map((bg) => `html[data-bg="${bg.id}"][data-theme="${bg.theme}"]{--scene-overlay:${SOFT_OVERLAY[bg.theme]}}`)
    .join("");
  // тёмная версия фона для тёмной темы (сейчас — только у основного фона «Бумага»)
  const darkVariants = BACKGROUNDS.filter((bg) => "darkVariant" in bg && bg.darkVariant)
    .map(
      (bg) =>
        `html[data-bg="${bg.id}"][data-theme="dark"]{--scene-image:url("${withBasePath(`/backgrounds/${bg.id}-dark.webp`, base)}");--scene-overlay:${SOFT_OVERLAY.dark}}`,
    )
    .join("");
  return `${desktop}@media (max-width: 767px){${mobile}}${backgrounds}${overlays}${darkVariants}`;
}
