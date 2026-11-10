import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  /** Более плотное стекло — для секций, которые должны выделяться (например, «Оплата»). */
  strong?: boolean;
};

/** Стеклянная панель секции поверх сцены. */
export function Panel({ children, className = "", strong = false }: PanelProps) {
  return (
    <div
      className={`${strong ? "glass-strong" : "glass"} rounded-[28px] border border-line px-5 py-10 shadow-panel sm:px-8 md:p-12 ${className}`}
    >
      {children}
    </div>
  );
}
