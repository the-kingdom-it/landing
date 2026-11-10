import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

export function Faq() {
  const { faq } = content;

  return (
    <section id={faq.id} className="py-6 md:py-10">
      <Container>
        <Panel className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading title={faq.title} lead={faq.lead} />
          <div className="border-t border-line">
            {faq.items.map((item, index) => (
              <details key={item.question} {...revealProps(index + 1)} className="group border-b border-line">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-200 group-open:rotate-45">
                    <Icon name="plus" className="size-4" strokeWidth={2} />
                  </span>
                </summary>
                <div className="pb-6 pr-0 md:pr-14">
                  <p className="leading-relaxed text-muted">{item.answer}</p>
                  {item.link ? (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
                    >
                      {item.link.label}
                      <Icon name="arrow-right" className="size-4" />
                    </a>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </Panel>
      </Container>
    </section>
  );
}
