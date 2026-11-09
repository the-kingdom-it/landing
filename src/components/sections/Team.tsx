import { content } from "@/content";
import { getInitials } from "@/lib/initials";
import { resolvePhoto } from "@/lib/photo";
import { revealProps } from "@/lib/reveal";
import { Avatar } from "../ui/Avatar";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Team() {
  const { team } = content;

  return (
    <section id={team.id} className="py-20 md:py-24">
      <Container>
        <SectionHeading title={team.title} />
        <ul className="mt-10 grid gap-4 md:mt-12 lg:grid-cols-2 lg:gap-6">
          {team.members.map((member, index) => (
            <li
              key={member.name}
              {...revealProps(index + 1)}
              className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-start md:p-8"
            >
              <Avatar src={resolvePhoto(member.photo)} alt={member.photoAlt} initials={getInitials(member.name)} />
              <div className="min-w-0">
                <h3 className="font-display text-[20px] leading-snug">{member.name}</h3>
                <p className="mt-1.5 font-semibold text-accent">{member.role}</p>
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
      </Container>
    </section>
  );
}
