import { content } from "@/content";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";

export function Header() {
  const { brand, header, ui, hero } = content;

  return (
    <header className="border-b border-line bg-canvas md:sticky md:top-0 md:z-20">
      <a
        href="#main"
        className="sr-only rounded-lg bg-ink px-4 py-3 text-on-dark focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30"
      >
        {ui.skipToContent}
      </a>
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3">
        <a href={`#${hero.id}`} className="flex min-h-11 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-[10px] bg-accent font-display text-[15px] text-on-accent"
          >
            {brand.initials}
          </span>
          <span className="text-[15px] font-semibold">{brand.name}</span>
        </a>

        <nav aria-label={ui.navLabel} className="order-last w-full md:order-none md:ml-auto md:w-auto">
          <ul className="-mx-2.5 flex flex-wrap gap-x-1">
            {header.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-[15px] text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink href={header.cta.href} size="sm" className="ml-auto md:ml-0">
          {header.cta.label}
        </ButtonLink>
      </Container>
    </header>
  );
}
