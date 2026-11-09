import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "outline" | "light";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  outline: "border border-ink text-ink hover:bg-ink hover:text-canvas",
  light: "bg-surface text-accent hover:bg-canvas",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 py-3 text-[15px]",
  sm: "min-h-11 px-4 py-2 text-sm",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", size = "md", icon, className = "" }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] text-center font-semibold leading-tight transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {icon ? <Icon name={icon} className="size-[18px] shrink-0" strokeWidth={2} /> : null}
    </a>
  );
}
