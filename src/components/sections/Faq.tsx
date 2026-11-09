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
                <p className="pb-6 pr-0 leading-relaxed text-muted md:pr-14">{item.answer}</p>
              </details>
            ))}
          </div>
        </Panel>
      </Container>
    </section>
  );
}
