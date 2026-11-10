import { content } from "@/content";
import { getInitials } from "@/lib/initials";
import { resolvePhoto } from "@/lib/photo";
import { revealProps } from "@/lib/reveal";
import Image from "next/image";
import { Avatar } from "../ui/Avatar";
import { Container } from "../ui/Container";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

export function Team() {
  const { team } = content;

  return (
    <section id={team.id} className="py-6 md:py-10">
      <Container>
        <Panel>
          <SectionHeading title={team.title} />
          <ul className="mt-10 grid gap-4 md:mt-12 lg:grid-cols-2 lg:gap-6">
            {team.members.map((member, index) => (
              <li
                key={member.name}
                {...revealProps(index + 1)}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-start md:p-8"
              >
                <div className="flex shrink-0 flex-col items-start gap-3">
                  <Avatar src={resolvePhoto(member.photo)} alt={member.photoAlt} initials={getInitials(member.name)} />
                  {member.company ? (
                    <span
                      data-company=""
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1.5 pr-3 text-xs font-medium text-ink"
                    >
                      <Image src={member.company.logo} alt="" width={20} height={20} unoptimized className="size-5" />
                      {member.company.name}
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[20px] leading-snug">{member.name}</h3>
                  <p className="mt-1.5 font-semibold text-gold">{member.role}</p>
                  <p className="mt-3 leading-relaxed text-muted">{member.description}</p>
                  {member.stack.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {member.stack.map((tech) => (
                        <li key={tech} className="rounded-md border border-line px-2 py-1 font-mono text-xs text-muted">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </Container>
    </section>
  );
}
