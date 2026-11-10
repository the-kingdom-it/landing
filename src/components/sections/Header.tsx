import { content } from "@/content";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";

export function Header() {
  const { brand, header, ui, hero } = content;

  return (
    <header className="site-header glass-strong relative z-40 border-b border-line lg:sticky lg:top-0">
      <a
        href="#main"
        className="sr-only rounded-lg bg-paper px-4 py-3 text-paper-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        {ui.skipToContent}
      </a>
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 sm:gap-x-4 lg:gap-x-8">
        <a href={`#${hero.id}`} className="flex min-h-11 items-center font-display text-[15px] text-ink sm:text-base">
          {brand.name}
        </a>

        <nav aria-label={ui.navLabel} className="order-last w-full lg:order-none lg:ml-auto lg:w-auto">
          <ul className="-mx-2 flex flex-wrap sm:-mx-2.5 sm:gap-x-1">
            {header.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink sm:px-2.5 sm:text-[15px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink href={header.cta.href} size="sm" className="ml-auto lg:ml-0">
          {header.cta.label}
        </ButtonLink>
      </Container>
    </header>
  );
}
