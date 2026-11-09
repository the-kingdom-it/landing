import { content } from "@/content";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { ReportCard } from "../ui/ReportCard";

export function Hero() {
  const { hero } = content;

  return (
    <section id={hero.id} className="pb-20 pt-12 md:pb-24 md:pt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <p className="flex items-center gap-2.5 font-mono text-[13px] text-muted">
            <span aria-hidden="true" className="size-2 rounded-[2px] bg-accent" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[34px] leading-[1.1] tracking-[-0.02em] sm:text-[46px] lg:text-[56px]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[580px] text-lg leading-relaxed text-muted">{hero.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={hero.primaryCta.href} icon="arrow-right">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        <ReportCard report={hero.report} />
      </Container>
    </section>
  );
}
