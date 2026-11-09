import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

export function Pricing() {
  const { pricing } = content;
  const card = pricing.postpayment;

  return (
    <section id={pricing.id} className="py-6 md:py-10">
      <Container>
        <Panel strong className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading title={pricing.title} lead={pricing.lead} />
          <div {...revealProps(1)} className="rounded-2xl bg-paper p-6 text-paper-ink md:p-10 [&_:focus-visible]:outline-accent">
            <p className="font-mono text-sm text-paper-muted">{card.label}</p>
            <p className="mt-4 break-words font-display text-[32px] leading-tight text-accent md:text-[44px]">
              {card.amount}
            </p>
            <p className="mt-4 leading-relaxed text-paper-muted">
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
        </Panel>
      </Container>
    </section>
  );
}
