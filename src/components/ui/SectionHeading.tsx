import { revealProps } from "@/lib/reveal";
import { type HandMark, MarkedText } from "./HandDrawn";

type SectionHeadingProps = {
  title: string;
  /** Слова заголовка, выделенные «от руки». */
  highlight?: { words: readonly string[]; mark: HandMark };
  lead?: string;
  className?: string;
};

export function SectionHeading({ title, highlight, lead, className = "" }: SectionHeadingProps) {
  return (
    <div {...revealProps()} className={`max-w-[760px] ${className}`}>
      <h2 className="text-balance font-display text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[34px] lg:text-[40px]">
        {highlight ? <MarkedText text={title} highlights={highlight.words} mark={highlight.mark} /> : title}
      </h2>
      {lead ? <p className="mt-4 text-[17px] leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}
