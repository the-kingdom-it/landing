import { content } from "@/content";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Pricing() {
  const { pricing } = content;

  return (
    <section id={pricing.id} className="bg-ink py-20 text-on-dark md:py-24">
      <Container>
        <SectionHeading title={pricing.title} lead={pricing.lead} tone="dark" />
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-line-dark p-6 md:p-10">
            <p className="font-mono text-sm text-on-dark-muted">{pricing.start.label}</p>
            <p className="mt-4 break-words font-display text-[32px] leading-tight md:text-[44px]">{pricing.start.amount}</p>
            <p className="mt-4 leading-relaxed text-on-dark-muted">{pricing.start.text}</p>
          </div>
          <div className="rounded-2xl bg-surface p-6 text-ink md:p-10">
            <p className="font-mono text-sm text-muted">{pricing.afterOffer.label}</p>
            <p className="mt-4 break-words font-display text-[32px] leading-tight text-accent md:text-[44px]">
              {pricing.afterOffer.amount}
            </p>
            <p className="mt-4 leading-relaxed text-muted">{pricing.afterOffer.text}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
