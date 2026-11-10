"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/backgrounds";
import { Icon } from "../ui/Icon";

type ThemeToggleProps = {
  labels: { toDark: string; toLight: string };
};

/*
 * Переключатель светлой и тёмной темы основного фона. Меняет <html data-theme> и запоминает выбор
 * в браузере посетителя. При предпросмотре другого фона (?bg=) кнопка скрыта (html[data-preview]).
 * Иконка и подпись зависят от темы через CSS, поэтому серверная разметка совпадает с клиентской.
 */
export function ThemeToggle({ labels }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
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
      className="theme-toggle inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink transition-colors hover:bg-surface"
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
