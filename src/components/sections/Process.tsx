import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

export function Process() {
  const { process } = content;

  return (
    <section id={process.id} className="py-6 md:py-10">
      <Container>
        <Panel>
          <SectionHeading title={process.title} lead={process.lead} />
          <ol className="mt-10 grid overflow-hidden rounded-2xl border border-line md:mt-12 md:grid-cols-2">
            {process.steps.map((step, index) => (
              <li
                key={step.title}
                className="border-b border-line bg-surface p-6 last:border-b-0 md:p-8 md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <div {...revealProps(index % 2)}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-medium text-gold">{String(index + 1).padStart(2, "0")}</span>
                    {step.badge ? (
                      <span className="rounded-full bg-passed-soft px-2.5 py-0.5 font-mono text-xs font-medium text-passed-fg">
                        {step.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-display text-[19px] leading-snug">{step.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </Container>
    </section>
  );
}
