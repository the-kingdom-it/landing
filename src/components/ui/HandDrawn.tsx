import { Fragment } from "react";
import { splitTitle } from "@/lib/title";

/* Линии «от руки» поверх слов. pathLength="1" позволяет анимировать прорисовку обводкой. */

const CIRCLE = "M150 12 C 95 2, 20 10, 8 45 C -2 78, 70 96, 120 92 C 175 88, 198 62, 190 36 C 182 14, 140 6, 92 9";
const UNDERLINE = "M3 13 C 40 4, 70 18, 105 10 S 165 5, 197 11";
/* Зачёркивание: чуть косая линия снизу вверх с лёгкой волной — как перечеркнули ручкой. */
const STRIKE = "M4 31 C 45 27, 80 24, 112 19 S 170 9, 196 7";

const MARKS = {
  circle: { d: CIRCLE, viewBox: "0 0 200 100" },
  underline: { d: UNDERLINE, viewBox: "0 0 200 20" },
  strike: { d: STRIKE, viewBox: "0 0 200 40" },
} as const;

export type HandMark = keyof typeof MARKS;

export function HandSvg({ mark, className }: { mark: HandMark; className: string }) {
  return (
    <svg className={className} viewBox={MARKS[mark].viewBox} preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d={MARKS[mark].d} />
    </svg>
  );
}

/**
 * Текст, в котором слова из highlights обведены или подчёркнуты «от руки».
 * Линия прорисовывается, когда блок появляется на экране (см. «РИСОВАННЫЕ ВЫДЕЛЕНИЯ» в globals.css).
 */
export function MarkedText({ text, highlights, mark }: { text: string; highlights: readonly string[]; mark: HandMark }) {
  return (
    <>
      {splitTitle(text, highlights).map((part, index) =>
        part.mark ? (
          <span key={index} className="title-nobreak">
            {part.prefix}
            <span className={`draw-mark draw-mark--${mark}`}>
              {part.text}
              <HandSvg mark={mark} className={`draw-svg draw-svg--${mark}`} />
            </span>
          </span>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
