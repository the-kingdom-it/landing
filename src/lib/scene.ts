import { BACKGROUNDS } from "./backgrounds";
import { withBasePath } from "./base-path";
import { SEASONS } from "./season";

/**
 * CSS с картинками сцены для каждого сезона (десктоп и портретный кроп для телефонов).
 * Собирается в коде, а не в globals.css, чтобы к путям добавлялся базовый путь сайта.
 */
export function sceneStyles(base: string): string {
  const rule = (season: string, file: string) =>
    `html[data-season="${season}"]{--scene-image:url("${withBasePath(`/scene/${file}.webp`, base)}")}`;
  const desktop = SEASONS.map((season) => rule(season, season)).join("");
  const mobile = SEASONS.map((season) => rule(season, `${season}-m`)).join("");
  // минималистичные фоны идут последними, чтобы перекрыть сезонную картинку и на телефонах
  const backgrounds = BACKGROUNDS.filter((id) => id !== "kingdom")
    .map((id) => `html[data-bg="${id}"]{--scene-image:url("${withBasePath(`/backgrounds/${id}.webp`, base)}")}`)
    .join("");
  return `${desktop}@media (max-width: 767px){${mobile}}${backgrounds}`;
}
