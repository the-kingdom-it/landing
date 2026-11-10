import { content } from "@/content";
import { revealProps } from "@/lib/reveal";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";
import { RoadmapTabs } from "./RoadmapTabs";

export function Roadmap() {
  const { roadmap } = content;

  return (
    <section id={roadmap.id} className="py-6 md:py-10">
      <Container>
        <Panel>
          <SectionHeading title={roadmap.title} lead={roadmap.lead} />
          <div {...revealProps(1)} className="mt-8 flex flex-col gap-4 rounded-2xl border border-gold/40 bg-gold-soft p-5 sm:flex-row md:p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold text-paper-ink">
              <Icon name="sparkles" className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-[17px] leading-snug">{roadmap.ai.title}</h3>
              <p className="mt-2 leading-relaxed text-ink">{roadmap.ai.text}</p>
            </div>
          </div>
          <div className="mt-10">
            <RoadmapTabs tracks={roadmap.tracks} labels={roadmap.labels} final={roadmap.final} />
          </div>
        </Panel>
      </Container>
    </section>
  );
}
