import type { Season } from "./season";

/** Сколько частиц летит в каждом сезоне: [десктоп, телефон]. */
const COUNTS: Record<Season, [number, number]> = {
  winter: [64, 28],
  spring: [22, 11],
  summer: [22, 12],
  autumn: [18, 9],
};

const LEAF_COLORS = ["#d9480f", "#e8590c", "#f08c00", "#c92a2a", "#b5492a"];
const PETAL_COLORS = ["#f8c8dc", "#f4a6c4", "#fde2ec", "#f9b4cc"];

export type ParticleStyle = Record<`--${string}`, string>;

export function particleCount(season: Season, isMobile: boolean): number {
  return COUNTS[season][isMobile ? 1 : 0];
}

const between = (rand: () => number, min: number, max: number) => min + rand() * (max - min);
const pick = <T,>(rand: () => number, list: T[]) => list[Math.min(list.length - 1, Math.floor(rand() * list.length))];

/** Случайные параметры частиц (CSS-переменные для анимаций в globals.css, блок «ЧАСТИЦЫ»). */
export function makeParticles(season: Season, count: number, rand: () => number = Math.random): ParticleStyle[] {
  return Array.from({ length: count }, () => {
    const fall =
      season === "winter" ? between(rand, 9, 20) : season === "summer" ? between(rand, 6, 12) : between(rand, 12, 24);
    const base: ParticleStyle = {
      "--x": `${Math.round(rand() * 100)}%`,
      "--fall": `${fall.toFixed(1)}s`,
      "--delay": `${(-rand() * fall).toFixed(1)}s`,
      "--sway": `${between(rand, 2.5, 6).toFixed(1)}s`,
    };

    switch (season) {
      case "winter": {
        const size = between(rand, 2, 6);
        return {
          ...base,
          "--size": `${size.toFixed(1)}px`,
          "--alpha": between(rand, 0.45, 0.95).toFixed(2),
          "--blur": `${size > 4.5 ? 1.2 : 0}px`,
          "--drift": `${Math.round(between(rand, 10, 40))}px`,
        };
      }
      case "autumn":
        return {
          ...base,
          "--size": `${Math.round(between(rand, 12, 20))}px`,
          "--color": pick(rand, LEAF_COLORS),
          "--drift": `${Math.round(between(rand, 40, 90))}px`,
          "--spin": `${between(rand, 4, 9).toFixed(1)}s`,
        };
      case "spring":
        return {
          ...base,
          "--size": `${Math.round(between(rand, 8, 13))}px`,
          "--color": pick(rand, PETAL_COLORS),
          "--drift": `${Math.round(between(rand, 30, 70))}px`,
          "--spin": `${between(rand, 5, 10).toFixed(1)}s`,
        };
      case "summer":
        return {
          ...base,
          "--y": `${Math.round(between(rand, 35, 95))}vh`,
          "--size": `${between(rand, 3, 5).toFixed(1)}px`,
          "--dx": `${Math.round(between(rand, -60, 60))}px`,
          "--dy": `${Math.round(between(rand, -50, 50))}px`,
        };
    }
  });
}
