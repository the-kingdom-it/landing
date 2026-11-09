import { content } from "@/content";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";

export function Referral() {
  const { referral } = content;

  return (
    <section id={referral.id} className="pb-20 md:pb-24">
      <Container>
        <div className="flex flex-col gap-6 rounded-2xl bg-accent p-6 text-on-accent md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
          <div className="flex items-start gap-5">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl border border-on-accent/40 sm:flex">
              <Icon name="users" className="size-6" />
            </span>
            <div>
              <h2 className="font-display text-[22px] leading-tight md:text-[28px]">{referral.title}</h2>
              <p className="mt-2 leading-relaxed">{referral.text}</p>
            </div>
          </div>
          <ButtonLink href={referral.cta.href} variant="light" className="shrink-0">
            {referral.cta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
