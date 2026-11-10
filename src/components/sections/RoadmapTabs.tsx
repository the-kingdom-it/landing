"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import type { RoadmapLabels, RoadmapStatuses, RoadmapTrack } from "@/content";
import { Icon } from "../ui/Icon";

type Status = "pending" | "running" | "passed";

/** Сколько этап «прогоняется», прежде чем стать PASSED, и пауза между этапами, появившимися одновременно. */
const RUN_MS = 700;
const STAGGER_MS = 300;

type RoadmapTabsProps = {
  tracks: RoadmapTrack[];
  labels: RoadmapLabels;
  statuses: RoadmapStatuses;
  final: { title: string; text: string };
};

/*
 * Вкладки треков и этапы роадмапа. Этап, доехавший до экрана, «прогоняется»: PENDING → RUNNING → PASSED.
 * Без IntersectionObserver или при «уменьшить движение» все этапы сразу PASSED.
 */
export function RoadmapTabs({ tracks, labels, statuses, final }: RoadmapTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [progress, setProgress] = useState<Record<string, Status>>({});
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const track = tracks[active];

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (!animate || !panel.current) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.stage;
          if (!key) continue;
          observer.unobserve(entry.target);
          const delay = order++ * STAGGER_MS;
          const run = () => setProgress((current) => (current[key] ? current : { ...current, [key]: "running" }));
          if (delay === 0) run();
          else timers.push(setTimeout(run, delay));
          timers.push(setTimeout(() => setProgress((current) => ({ ...current, [key]: "passed" })), delay + RUN_MS));
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    panel.current.querySelectorAll<HTMLElement>("[data-stage]").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      // этап, который «прогонялся» при переключении вкладки, считаем пройденным
      setProgress((current) =>
        Object.fromEntries(Object.entries(current).map(([key, value]) => [key, value === "running" ? "passed" : value])),
      );
    };
  }, [animate, active]);

  const statusOf = (key: string): Status => (animate ? (progress[key] ?? "pending") : "passed");

  const select = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = tracks.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % tracks.length
        : event.key === "ArrowLeft"
          ? (active - 1 + tracks.length) % tracks.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div>
      <div role="tablist" aria-label={labels.tabs} className="grid gap-2 sm:grid-cols-3">
        {tracks.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={`flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-xl border px-4 py-3 text-left transition-colors ${
                selected ? "border-gold bg-gold-soft text-ink" : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              <span className="font-display text-[15px]">{item.title}</span>
              <span className="font-mono text-xs text-muted">{item.duration}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={panel}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${track.id}`}
        className="mt-8"
      >
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-sm text-muted">{labels.goal}</span>
          <span className="text-lg font-semibold text-ink">{track.goal}</span>
        </p>

        <ol className="mt-8 grid gap-4">
          {track.stages.map((stage, index) => {
            const key = `${track.id}:${index}`;
            const status = statusOf(key);
            return (
              <li key={key} data-stage={key} className="relative pl-10 sm:pl-12">
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-4 left-[11px] top-0 w-0.5 transition-colors duration-500 ${status === "passed" ? "bg-passed" : "bg-line"}`}
                />
                <StatusNode status={status} />
                <div className="rounded-2xl border border-line bg-surface p-5 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="font-mono text-xs tracking-wide text-muted">{`${labels.stage} ${index}`}</span>
                    <StatusBadge status={status} statuses={statuses} />
                  </div>
                  <h3 className="mt-3 flex flex-wrap items-center gap-2 font-display text-[19px] leading-snug">
                    {stage.title}
                    {stage.ai ? (
                      <span className="rounded-md bg-gold px-1.5 py-0.5 font-mono text-[11px] font-semibold text-paper-ink">
                        {labels.ai}
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{stage.subtitle}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-mono text-xs text-muted">{labels.learn}</p>
                      <p className="mt-1.5 leading-relaxed text-ink">{stage.learn}</p>
                    </div>
                    <div className="rounded-xl border border-line bg-white/5 p-4">
                      <p className="font-mono text-xs text-gold">{labels.result}</p>
                      <p className="mt-1.5 leading-relaxed text-ink">{stage.result}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="relative pl-10 sm:pl-12">
            <span aria-hidden="true" className="absolute left-0 top-6 size-6 rounded-full border-2 border-gold bg-gold-soft" />
            <div className="rounded-2xl border border-gold/60 bg-gold-soft p-5 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-[19px] leading-snug text-gold">{final.title}</h3>
                <span className="rounded-md border border-gold/60 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-gold">
                  {statuses.next}
                </span>
              </div>
              <p className="mt-2 leading-relaxed text-ink">{final.text}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

function StatusNode({ status }: { status: Status }) {
  const base = "absolute left-0 top-6 size-6";
  if (status === "passed") {
    return (
      <span aria-hidden="true" className={`${base} flex items-center justify-center rounded-full bg-passed text-on-accent`}>
        <Icon name="check" className="size-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "running") {
    return <span aria-hidden="true" className={`${base} animate-spin rounded-full border-2 border-gold border-t-transparent`} />;
  }
  return <span aria-hidden="true" className={`${base} rounded-md border-2 border-white/25 bg-canvas`} />;
}

function StatusBadge({ status, statuses }: { status: Status; statuses: RoadmapStatuses }) {
  const styles: Record<Status, string> = {
    pending: "border-line text-muted",
    running: "border-gold/60 text-gold",
    passed: "border-passed-fg/40 bg-passed-soft text-passed-fg",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide ${styles[status]}`}
    >
      {status === "running" ? <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-gold" /> : null}
      {statuses[status]}
    </span>
  );
}
