"use client";

import { useEffect, useRef, useState } from "react";

/** Пауза после появления на экране (пока карточка проявляется), скорость печати и сколько мигает курсор после. */
const START_DELAY_MS = 450;
const CHAR_MS = 70;
const CARET_AFTER_MS = 1400;
/** Пауза между строками одной очереди: следующая начинает печататься после предыдущей. */
const QUEUE_GAP_MS = 250;

type Deferred = { promise: Promise<void>; resolve: () => void };
function deferred(): Deferred {
  let resolve = () => {};
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

/** Очереди печати: строка с index ждёт, пока допечатается строка index - 1 той же группы. */
const queues = new Map<string, Map<number, Deferred>>();

type Queue = { group: string; index: number };

/*
 * Текст «печатается» по буквам с мигающим курсором, когда доезжает до экрана.
 * Место под полный текст зарезервировано невидимой копией — ничего не прыгает.
 * Скринридеры читают полный текст сразу. Без JS и при «уменьшить движение» текст виден целиком.
 */
export function TypedText({ text, className = "", queue }: { text: string; className?: string; queue?: Queue }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string | null>(null);
  const [caret, setCaret] = useState(false);

  const group = queue?.group;
  const index = queue?.index ?? 0;

  useEffect(() => {
    // своё место в очереди: следующая строка группы ждёт, пока эта допечатается
    const done = deferred();
    if (group) {
      if (!queues.has(group)) queues.set(group, new Map());
      queues.get(group)!.set(index, done);
    }
    const finish = () => done.resolve();

    if (!("IntersectionObserver" in window) || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return () => {
        queues.get(group ?? "")?.delete(index);
      };
    }
    const node = ref.current;
    if (!node) return;

    setShown("");
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const type = (delay: number) => {
      if (cancelled) return;
      setCaret(true);
      for (let i = 1; i <= text.length; i++) {
        timers.push(setTimeout(() => setShown(text.slice(0, i)), delay + i * CHAR_MS));
      }
      timers.push(setTimeout(finish, delay + text.length * CHAR_MS));
      timers.push(setTimeout(() => setCaret(false), delay + text.length * CHAR_MS + CARET_AFTER_MS));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const previous = group ? queues.get(group)?.get(index - 1) : undefined;
        if (previous) previous.promise.then(() => type(QUEUE_GAP_MS));
        else type(START_DELAY_MS);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach(clearTimeout);
      finish();
      if (group) queues.get(group)?.delete(index);
    };
  }, [text, group, index]);

  return (
    <span ref={ref} className={`typed ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="typed-stack">
        <span className="typed-reserve">{text}</span>
        <span data-typed="" className="typed-text">
          {shown ?? text}
          {caret ? <span className="typed-caret" /> : null}
        </span>
      </span>
    </span>
  );
}
