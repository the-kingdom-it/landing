"use client";

import { useEffect, useRef, useState } from "react";
import type { BugReward } from "@/content";
import {
  BUG,
  type Bug,
  isInLens,
  isOffscreen,
  makePromoCode,
  type Point,
  type Rect,
  scatterBug,
  spawnBug,
  stepBug,
} from "@/lib/bugs";
import { Icon } from "../ui/Icon";
import { BugDefs, BugSprite } from "./BugSprite";

const CATCH_ANIMATION_MS = 450;

/**
 * Жук ползает под блоками интерфейса. Поймать наведением можно, только если в этой точке виден сам жук,
 * а не панель над ним.
 */
export function isBugUncovered(node: HTMLElement | undefined, point: Point): boolean {
  if (!node || typeof document.elementFromPoint !== "function") return true;
  const hit = document.elementFromPoint(point.x, point.y);
  return hit !== null && node.contains(hit);
}

/** Блоки интерфейса, которые жуки обходят: панели секций, шапка и футер, видимые на экране. */
const OBSTACLE_SELECTOR = "main > section > div > *, header, footer";

function visibleObstacles(height: number): Rect[] {
  const rects: Rect[] = [];
  for (const element of document.querySelectorAll(OBSTACLE_SELECTOR)) {
    const r = element.getBoundingClientRect();
    if (r.bottom > 0 && r.top < height && r.width > 0) rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  }
  return rects;
}

const toTransform = (bug: Bug) => `translate3d(${bug.x}px, ${bug.y}px, 0) rotate(${bug.angle + Math.PI / 2}rad)`;

/*
 * Жуки ползают по экрану, их ловят лупой: навести кольцо и задержать или кликнуть (на телефоне — тап).
 * Движение считается в requestAnimationFrame и пишется прямо в style.transform — без перерисовки React.
 * При «уменьшить движение» жуков нет.
 */
export function Bugs({ counterLabel, reward }: { counterLabel: string; reward: BugReward | null }) {
  const [ids, setIds] = useState<number[]>([]);
  const [caught, setCaught] = useState(0);
  const [promo, setPromo] = useState<string | null>(null);
  /** После награды жуки разбегаются и больше не появляются. */
  const [scattered, setScattered] = useState(false);
  const caughtCount = useRef(0);
  const goal = reward?.goal ?? null;
  const [caughtIds, setCaughtIds] = useState<ReadonlySet<number>>(() => new Set());
  const bugs = useRef(new Map<number, Bug>());
  /* последняя позиция каждого жука: пойманный остаётся на месте, пока играет анимация */
  const transforms = useRef(new Map<number, string>());
  const nodes = useRef(new Map<number, HTMLDivElement>());
  const catchBug = useRef<(id: number) => void>(() => {});

  useEffect(() => {
    const media = (query: string) => window.matchMedia?.(query).matches ?? false;
    if (media("(prefers-reduced-motion: reduce)") || typeof requestAnimationFrame !== "function") return;

    const root = document.documentElement;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const max = window.innerWidth < 768 ? 2 : 4;
    const view = () => ({ width: window.innerWidth, height: window.innerHeight });
    let cursor: Point | null = null;
    let nextId = 1;
    let active = true;
    let done = false;
    const steady = () => 0.5;
    root.dataset.bugs = "";

    const later = (fn: () => void, ms: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const spawn = () => {
      if (!active || done || bugs.current.size >= max) return;
      const id = nextId++;
      const bug = spawnBug(id, view());
      bugs.current.set(id, bug);
      transforms.current.set(id, toTransform(bug));
      setIds((list) => [...list, id]);
    };

    const drop = (id: number) => {
      transforms.current.delete(id);
      setIds((list) => list.filter((other) => other !== id));
      setCaughtIds((set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    };

    // награда получена: оставшиеся жуки разбегаются к краям и больше не появляются
    const finish = () => {
      done = true;
      cursor = null;
      delete root.dataset.bugs;
      const size = view();
      for (const [id, bug] of bugs.current) bugs.current.set(id, scatterBug(bug, size));
      setScattered(true);
    };

    catchBug.current = (id) => {
      if (done || !bugs.current.delete(id)) return;
      setCaughtIds((set) => new Set(set).add(id));
      caughtCount.current += 1;
      setCaught(caughtCount.current);
      if (goal !== null && caughtCount.current >= goal) {
        setPromo((code) => code ?? makePromoCode());
        finish();
      }
      later(() => {
        drop(id);
        later(spawn, 1500 + Math.random() * 2000);
      }, CATCH_ANIMATION_MS);
    };

    for (let i = 0; i < max; i++) later(spawn, i * 1400);

    let raf = 0;
    let last = 0;
    const frame = (time: number) => {
      const dt = last ? time - last : 16;
      last = time;
      const size = view();
      const obstacles = done ? [] : visibleObstacles(size.height);
      for (const [id, bug] of bugs.current) {
        const moved = done ? stepBug(bug, dt, size, null, steady) : stepBug(bug, dt, size, cursor, Math.random, obstacles);
        if (isOffscreen(moved, size)) {
          bugs.current.delete(id);
          drop(id);
          later(spawn, 800 + Math.random() * 1500);
          continue;
        }
        const inLens = !done && cursor !== null && isInLens(moved, cursor) && isBugUncovered(nodes.current.get(id), cursor);
        const next = { ...moved, dwell: inLens ? moved.dwell + Math.min(dt, BUG.maxFrameMs) : 0 };
        if (next.dwell >= BUG.dwellMs) {
          catchBug.current(id);
          continue;
        }
        bugs.current.set(id, next);
        const transform = toTransform(next);
        transforms.current.set(id, transform);
        const node = nodes.current.get(id);
        if (node) node.style.transform = transform;
      }
      if (done && bugs.current.size === 0) return;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") cursor = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => {
      cursor = null;
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    const tracked = bugs.current;
    const trackedTransforms = transforms.current;
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      tracked.clear();
      trackedTransforms.clear();
      delete root.dataset.bugs;
    };
  }, [goal]);

  return (
    <>
      <div className="bugs" aria-hidden="true">
        <BugDefs />
        {ids.map((id) => (
          <div
            key={id}
            data-bug=""
            className={caughtIds.has(id) ? "bug bug--caught" : scattered ? "bug bug--scatter" : "bug"}
            style={{ transform: transforms.current.get(id) }}
            ref={(node) => {
              if (node) nodes.current.set(id, node);
              else nodes.current.delete(id);
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              catchBug.current(id);
            }}
            // тап по жуку не должен «проваливаться» на кнопку или ссылку под ним
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <BugSprite />
          </div>
        ))}
      </div>
      {reward && promo ? (
        <div role="status" aria-live="polite" className="bug-counter bug-reward glass-strong border border-highlight shadow-panel">
          <p className="font-display text-[15px] text-highlight">{reward.title}</p>
          <p className="mt-1.5 font-mono text-sm text-ink">
            {`${reward.codeLabel} `}
            <span className="select-all font-semibold tracking-wider text-highlight">{promo}</span>
          </p>
          <a
            href={reward.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
          >
            {reward.linkLabel}
            <Icon name="send" className="size-4" />
          </a>
        </div>
      ) : caught > 0 ? (
        <div role="status" aria-live="polite" className="bug-counter glass-strong border border-line font-mono text-sm text-ink shadow-panel">
          {`${counterLabel}: ${caught}`}
        </div>
      ) : null}
    </>
  );
}
