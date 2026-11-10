import type { ArtStyle } from "@/lib/art";

/*
 * ФИЧА-ТОГЛЫ
 * Включают и выключают эффекты сайта. Поменяй значение и пересобери сайт (на GitHub Pages — мёрдж в main).
 */
export const features: { snow: boolean; roadmapArt: ArtStyle } = {
  /** Снег (и другие сезонные частицы: листья, лепестки, светлячки). */
  snow: false,
  /** Картинки в карточках роадмапа: "mesh" — каркасная сетка, "outline" — контур со свечением, "off" — без картинок. */
  roadmapArt: "mesh",
};
