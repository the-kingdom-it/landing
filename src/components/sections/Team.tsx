import { content } from "@/content";
import { withBasePath } from "@/lib/base-path";
import { getInitials } from "@/lib/initials";
import { resolvePhoto } from "@/lib/photo";
import { revealProps } from "@/lib/reveal";
import Image from "next/image";
import { Avatar } from "../ui/Avatar";
import { Icon } from "../ui/Icon";
import { Container } from "../ui/Container";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";
import { TypedText } from "../ui/TypedText";

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
                <div className="flex w-[120px] shrink-0 flex-col gap-3 md:w-40">
                  <Avatar
                    src={(() => {
                      const photo = resolvePhoto(member.photo);
                      return photo ? withBasePath(photo) : null;
                    })()}
                    alt={member.photoAlt}
                    initials={getInitials(member.name)}
                  />
                  {member.company ? (
                    <span
                      data-company=""
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink"
                    >
                      <Image src={withBasePath(member.company.logo)} alt="" width={20} height={20} unoptimized className="size-5" />
                      {member.company.name}
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[20px] leading-snug">{member.name}</h3>
                  <p className="mt-1.5 font-semibold text-highlight">
                    <TypedText text={member.role} queue={{ group: "team-roles", index }} />
                  </p>
                  <p className="mt-3 leading-relaxed text-muted">{member.description}</p>
                  {member.links.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {member.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-highlight hover:text-highlight"
                          >
                            <Icon name="send" className="size-4" />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
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
