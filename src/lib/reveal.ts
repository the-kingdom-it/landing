import type { CSSProperties } from "react";

const STEP_MS = 90;
const MAX_STEPS = 5;

/**
 * Пропсы для блока, который проявляется при прокрутке (см. ScrollReveal и globals.css).
 * index — порядковый номер в группе: соседние карточки появляются с небольшой задержкой друг за другом.
 */
export function revealProps(index = 0): { "data-reveal": ""; style: CSSProperties } {
  const delay = Math.min(index, MAX_STEPS) * STEP_MS;
  return { "data-reveal": "", style: { "--reveal-delay": `${delay}ms` } as CSSProperties };
}

/** Задержка для анимаций первого экрана (классы motion-* в globals.css). */
export function motionDelay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}
