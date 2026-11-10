/** Картинки для карточек роадмапа (компонент WireArt). */
export const ART_NAMES = ["magnifier", "bug", "globe", "cube", "robot", "chip", "gear", "rocket"] as const;
export type ArtName = (typeof ART_NAMES)[number];

/** Стиль картинок: "mesh" — каркасная сетка, "outline" — только контур со свечением, "off" — без картинок. */
export type ArtStyle = "mesh" | "outline" | "off";
