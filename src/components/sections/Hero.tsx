import type { CSSProperties } from "react";
import { content } from "@/content";
import { motionDelay } from "@/lib/reveal";
import { splitTitle } from "@/lib/title";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { ReportCard } from "../ui/ReportCard";

export function Hero() {
  const { hero, bugs } = content;

  return (
    <section id={hero.id} className="pb-6 pt-10 md:pb-10 md:pt-16">
      <Container className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-8">
        <div className="glass rounded-[28px] border border-line p-6 shadow-panel sm:p-8 md:p-10">
          {hero.eyebrow ? (
            <p className="mb-5 flex items-center gap-2.5 font-mono text-[13px] text-muted">
              <span aria-hidden="true" className="size-2 rounded-[2px] bg-highlight" />
              {hero.eyebrow}
            </p>
          ) : null}
          <h1 style={motionDelay(0)} className="motion-rise text-balance font-display text-[34px] leading-[1.1] tracking-[-0.02em] sm:text-[46px] lg:text-[54px]">
            {(() => {
              let markIndex = 0;
              return splitTitle(hero.title, hero.titleHighlights).map((part, index) =>
                part.mark ? (
                  // предлог и выделенное слово не разрываются переносом строки
                  <span key={index} className="title-nobreak">
                    {part.prefix}
                    <span className="title-mark" style={{ "--i": String(markIndex++) } as CSSProperties}>
                      {part.text}
                      {/* овал «от руки» для варианта 9: рисуется анимацией обводки */}
                      <svg className="title-circle" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
                        <path
                          pathLength="1"
                          d="M150 12 C 95 2, 20 10, 8 45 C -2 78, 70 96, 120 92 C 175 88, 198 62, 190 36 C 182 14, 140 6, 92 9"
                        />
                      </svg>
                    </span>
                  </span>
                ) : (
                  part.text
                ),
              );
            })()}
          </h1>
          <p style={motionDelay(100)} className="motion-rise mt-6 max-w-[580px] text-lg leading-relaxed text-muted">
            {hero.subtitle}
          </p>
          <div style={motionDelay(200)} className="motion-rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={hero.primaryCta.href} icon="arrow-right">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          {bugs ? (
            <p style={motionDelay(300)} className="bug-hint motion-rise mt-6 font-mono text-[13px] leading-relaxed text-muted">
              {bugs.hint}
            </p>
          ) : null}
        </div>
        <ReportCard report={hero.report} />
      </Container>
    </section>
  );
}
