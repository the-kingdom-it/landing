"use client";

import { type BackgroundId, THEME_STORAGE_KEY, type Theme } from "@/lib/backgrounds";
import { Icon } from "../ui/Icon";

type ThemeToggleProps = {
  labels: { toDark: string; toLight: string };
  backgrounds: Record<Theme, BackgroundId>;
};

/*
 * Переключатель светлой и тёмной темы. Меняет <html data-theme> и фон-пару для темы,
 * запоминает выбор в браузере посетителя. Если фон задан через ?bg=, меняется только тема.
 * Иконка и подпись зависят от темы через CSS, поэтому серверная разметка совпадает с клиентской.
 */
export function ThemeToggle({ labels, backgrounds }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    if (!new URLSearchParams(window.location.search).get("bg")) root.dataset.bg = backgrounds[next];
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // браузер не даёт сохранить — тема просто не запомнится
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink transition-colors hover:bg-surface"
    >
      <span className="theme-when-light">
        <Icon name="moon" className="size-5" />
        <span className="sr-only">{labels.toDark}</span>
      </span>
      <span className="theme-when-dark">
        <Icon name="sun" className="size-5" />
        <span className="sr-only">{labels.toLight}</span>
      </span>
    </button>
  );
}
