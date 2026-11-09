"use client";

import { useEffect } from "react";

/*
 * Проявляет блоки с атрибутом data-reveal, когда они доезжают до экрана при прокрутке.
 * Блоки, уже видимые при загрузке, показываются сразу. Без JS, без IntersectionObserver
 * или при включённом «уменьшить движение» в системе всё видно без анимации.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const pending: HTMLElement[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.dataset.revealed = "";
      else pending.push(el);
    }
    root.dataset.revealReady = "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      delete root.dataset.revealReady;
    };
  }, []);

  return null;
}
