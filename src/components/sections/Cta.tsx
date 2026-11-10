import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Cta() {
  const { cta } = content;

  return (
    <section id={cta.id} className="py-6 md:py-10">
      <Container>
        <div
          {...revealProps()}
          className="glass flex flex-col items-center rounded-[28px] border border-line px-6 py-12 text-center shadow-panel md:px-12 md:py-16"
        >
          <SectionHeading
            title={cta.title}
            highlight={{ words: cta.titleHighlights, mark: cta.titleMark }}
            lead={cta.text}
          />
          <ButtonLink href={cta.button.href} icon="send" className="mt-8 w-full sm:w-auto">
            {cta.button.label}
          </ButtonLink>
          <p className="mt-4 font-mono text-sm text-muted">{cta.handle}</p>
        </div>
      </Container>
    </section>
  );
}
