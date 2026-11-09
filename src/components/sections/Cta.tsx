import { content } from "@/content";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Cta() {
  const { cta } = content;

  return (
    <section id={cta.id} className="border-t border-line py-20 md:py-24">
      <Container>
        <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-12 text-center md:px-12 md:py-16">
          <SectionHeading title={cta.title} lead={cta.text} />
          <ButtonLink href={cta.button.href} icon="send" className="mt-8 w-full sm:w-auto">
            {cta.button.label}
          </ButtonLink>
          <p className="mt-4 font-mono text-sm text-muted">{cta.handle}</p>
        </div>
      </Container>
    </section>
  );
}
