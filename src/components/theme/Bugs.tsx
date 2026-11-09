"use client";

import { useEffect, useRef, useState } from "react";
import { BUG, type Bug, isInLens, isOffscreen, type Point, spawnBug, stepBug } from "@/lib/bugs";
import { BugDefs, BugSprite } from "./BugSprite";

const CATCH_ANIMATION_MS = 450;

const toTransform = (bug: Bug | undefined) =>
  bug ? `translate3d(${bug.x}px, ${bug.y}px, 0) rotate(${bug.angle + Math.PI / 2}rad)` : undefined;

/*
 * Жуки ползают по экрану, их ловят лупой: навести кольцо и задержать или кликнуть (на телефоне — тап).
 * Движение считается в requestAnimationFrame и пишется прямо в style.transform — без перерисовки React.
 * При «уменьшить движение» жуков нет.
 */
export function Bugs({ counterLabel }: { counterLabel: string }) {
  const [ids, setIds] = useState<number[]>([]);
  const [caught, setCaught] = useState(0);
  const bugs = useRef(new Map<number, Bug>());
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
    root.dataset.bugs = "";

    const later = (fn: () => void, ms: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const spawn = () => {
      if (!active || bugs.current.size >= max) return;
      const id = nextId++;
      bugs.current.set(id, spawnBug(id, view()));
      setIds((list) => [...list, id]);
    };

    const drop = (id: number) => setIds((list) => list.filter((other) => other !== id));

    catchBug.current = (id) => {
      if (!bugs.current.delete(id)) return;
      nodes.current.get(id)?.classList.add("bug--caught");
      setCaught((count) => count + 1);
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
      for (const [id, bug] of bugs.current) {
        const moved = stepBug(bug, dt, size, cursor);
        if (isOffscreen(moved, size)) {
          bugs.current.delete(id);
          drop(id);
          later(spawn, 800 + Math.random() * 1500);
          continue;
        }
        const next = { ...moved, dwell: isInLens(moved, cursor) ? moved.dwell + Math.min(dt, BUG.maxFrameMs) : 0 };
        if (next.dwell >= BUG.dwellMs) {
          catchBug.current(id);
          continue;
        }
        bugs.current.set(id, next);
        const node = nodes.current.get(id);
        if (node) node.style.transform = toTransform(next) ?? "";
      }
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
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      tracked.clear();
      delete root.dataset.bugs;
    };
  }, []);

  return (
    <>
      <div className="bugs" aria-hidden="true">
        <BugDefs />
        {ids.map((id) => (
          <div
            key={id}
            data-bug=""
            className="bug"
            style={{ transform: toTransform(bugs.current.get(id)) }}
            ref={(node) => {
              if (node) nodes.current.set(id, node);
              else nodes.current.delete(id);
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              catchBug.current(id);
            }}
          >
            <BugSprite />
          </div>
        ))}
      </div>
      {caught > 0 ? (
        <div role="status" aria-live="polite" className="bug-counter glass-strong border border-line font-mono text-sm text-ink shadow-panel">
          {`${counterLabel}: ${caught}`}
        </div>
      ) : null}
    </>
  );
}
