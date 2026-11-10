import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

export function Audience() {
  const { audience } = content;

  return (
    <section id={audience.id} className="py-6 md:py-10">
      <Container>
        <Panel>
          <SectionHeading title={audience.title} />
          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
            {audience.items.map((item, index) => (
              <li
                key={item.title}
                {...revealProps(index + 1)}
                className="rounded-2xl border border-line bg-surface p-6 md:p-8"
              >
                <span className="flex size-11 items-center justify-center rounded-[10px] bg-highlight-soft text-highlight">
                  <Icon name={item.icon} className="size-[22px]" />
                </span>
                <h3 className="mt-6 font-display text-[19px] leading-snug">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </Container>
    </section>
  );
}
