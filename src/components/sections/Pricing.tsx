import { content, type PricePlan } from "@/content";
import { revealProps } from "@/lib/reveal";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";

/*
 * Тарифы. На телефоне карточки листаются свайпом (scroll-snap), край следующей виден;
 * от md – сетка из двух колонок без прокрутки.
 * Ряд выходит под боковые отступы панели (-mx), чтобы карточка листалась до края панели.
 * Появление при прокрутке висит на всём ряду: карточка, обрезанная рядом, сама бы не проявилась.
 */
export function Pricing() {
  const { pricing } = content;

  return (
    <section id={pricing.id} className="py-6 md:py-10">
      <Container>
        <Panel strong>
          <SectionHeading title={pricing.title} lead={pricing.lead} />
          <ul
            data-plans=""
            {...revealProps(1)}
            className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
          >
            {pricing.plans.map((plan) => (
              <li key={plan.id} className="w-[calc(100%-1.75rem)] max-w-[420px] shrink-0 snap-start md:w-auto md:max-w-none">
                <PlanCard plan={plan} />
              </li>
            ))}
          </ul>
        </Panel>
      </Container>
    </section>
  );
}

function PlanCard({ plan }: { plan: PricePlan }) {
  const { labels } = content.pricing;
  const titleId = `plan-${plan.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col rounded-2xl bg-paper p-5 text-paper-ink ring-1 ring-paper-ink/10 sm:p-6 lg:p-8 [&_:focus-visible]:outline-accent"
    >
      <h3 id={titleId} className="font-display text-[20px] leading-tight sm:text-[22px] lg:text-[26px]">
        {plan.title}
      </h3>
      <p className="mt-3 leading-relaxed text-paper-muted">{plan.audience}</p>

      <p className="mt-6 font-display text-[40px] leading-none text-accent lg:text-[48px]">{plan.price}</p>
      <p className="mt-2 text-paper-muted">
        {labels.prepayment} + {plan.share}
      </p>

      <ul className="mt-6 grid gap-3 xl:grid-cols-2 xl:gap-x-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={2.2} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <div className="rounded-xl border border-accent/40 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-muted">{labels.result}</p>
          <p className="mt-2 leading-snug">
            {labels.offerPrefix} <span className="block font-semibold">{plan.result.position}</span>
          </p>
          <p className="mt-2 font-display text-lg text-accent">{plan.result.salary}</p>
        </div>
        <ButtonLink href={plan.cta.href} className="mt-4 w-full">
          {plan.cta.label}
        </ButtonLink>
      </div>
    </article>
  );
}
