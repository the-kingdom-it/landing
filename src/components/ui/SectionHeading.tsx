import { revealProps } from "@/lib/reveal";

type SectionHeadingProps = {
  title: string;
  lead?: string;
  className?: string;
};

export function SectionHeading({ title, lead, className = "" }: SectionHeadingProps) {
  return (
    <div {...revealProps()} className={`max-w-[760px] ${className}`}>
      <h2 className="text-balance font-display text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[34px] lg:text-[40px]">
        {title}
      </h2>
      {lead ? <p className="mt-4 text-[17px] leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}
