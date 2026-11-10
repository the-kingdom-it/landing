"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { makeParticles, particleCount, type ParticleStyle } from "@/lib/particles";
import { SEASONS, type Season } from "@/lib/season";

/** Доля частиц в переднем слое (крупнее, поверх контента, не перехватывают клики). */
const FRONT_SHARE = 0.35;

type Layers = { season: Season; back: ParticleStyle[]; front: ParticleStyle[] };

/*
 * Сезонные частицы: снег, листья, лепестки или светлячки.
 * Задний слой — за стеклом, передний — немного крупных частиц поверх контента для глубины.
 * Сезон берётся из <html data-season>. При «уменьшить движение» ничего не рисуется.
 */
export function Particles() {
  const [layers, setLayers] = useState<Layers | null>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const season = document.documentElement.dataset.season as Season | undefined;
    if (!season || !SEASONS.includes(season)) return;
    const total = particleCount(season, window.innerWidth < 768);
    const frontCount = Math.max(1, Math.round(total * FRONT_SHARE));
    setLayers({ season, back: makeParticles(season, total - frontCount), front: makeParticles(season, frontCount) });
  }, []);

  if (!layers) return null;

  return (
    <>
      <ParticleLayer season={layers.season} depth="back" particles={layers.back} />
      <ParticleLayer season={layers.season} depth="front" particles={layers.front} />
    </>
  );
}

function ParticleLayer({ season, depth, particles }: { season: Season; depth: "back" | "front"; particles: ParticleStyle[] }) {
  return (
    <div aria-hidden="true" className={`particles particles--${season} particles--${depth}`}>
      {particles.map((style, index) => (
        <span key={index} className="particle" style={style as CSSProperties}>
          <i />
        </span>
      ))}
    </div>
  );
}
