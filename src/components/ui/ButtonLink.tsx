import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "outline" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  outline: "border border-ink text-ink hover:bg-ink hover:text-canvas",
  light: "bg-surface text-accent hover:bg-canvas",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", icon, className = "" }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-center text-[15px] font-semibold leading-tight transition-colors ${variants[variant]} ${className}`}
    >
      {children}
      {icon ? <Icon name={icon} className="size-[18px] shrink-0" strokeWidth={2} /> : null}
    </a>
  );
}
