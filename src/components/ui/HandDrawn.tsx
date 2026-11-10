import { Fragment } from "react";
import { splitTitle } from "@/lib/title";

/* Линии «от руки» поверх слов. pathLength="1" позволяет анимировать прорисовку обводкой. */

const CIRCLE = "M150 12 C 95 2, 20 10, 8 45 C -2 78, 70 96, 120 92 C 175 88, 198 62, 190 36 C 182 14, 140 6, 92 9";
const UNDERLINE = "M3 13 C 40 4, 70 18, 105 10 S 165 5, 197 11";

export type HandMark = "circle" | "underline";

export function HandSvg({ mark, className }: { mark: HandMark; className: string }) {
  return (
    <svg
      className={className}
      viewBox={mark === "circle" ? "0 0 200 100" : "0 0 200 20"}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path pathLength="1" d={mark === "circle" ? CIRCLE : UNDERLINE} />
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
