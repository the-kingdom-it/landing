import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Pricing() {
  const { pricing } = content;
  const card = pricing.postpayment;

  return (
    <section id={pricing.id} className="bg-ink py-20 text-on-dark md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <SectionHeading title={pricing.title} lead={pricing.lead} tone="dark" />
        <div {...revealProps(1)} className="rounded-2xl bg-surface p-6 text-ink md:p-10">
          <p className="font-mono text-sm text-muted">{card.label}</p>
          <p className="mt-4 break-words font-display text-[32px] leading-tight text-accent md:text-[44px]">
            {card.amount}
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            {card.text}
            {card.link ? (
              <>
                {" "}
                <a
                  href={card.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {card.link.label}
                </a>
              </>
            ) : null}
          </p>
        </div>
      </Container>
    </section>
  );
}
