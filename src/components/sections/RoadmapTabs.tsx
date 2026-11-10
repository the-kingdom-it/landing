"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";
import type { RoadmapLabels, RoadmapTrack } from "@/content";

type RoadmapTabsProps = {
  tracks: RoadmapTrack[];
  labels: RoadmapLabels;
  final: { title: string; text: string };
};

/* Вкладки треков роадмапа и этапы выбранного трека. */
export function RoadmapTabs({ tracks, labels, final }: RoadmapTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const track = tracks[active];

  const select = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % tracks.length
        : event.key === "ArrowLeft"
          ? (active - 1 + tracks.length) % tracks.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tracks.length - 1
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
              className={`flex min-h-14 items-center rounded-xl border px-4 py-3 text-left font-display text-[15px] transition-colors ${
                selected ? "border-gold bg-gold-soft text-ink" : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${track.id}`} className="mt-8">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-sm text-muted">{labels.goal}</span>
          <span className="text-lg font-semibold text-ink">{track.goal}</span>
        </p>

        <ol className="mt-8 grid gap-4">
          {track.stages.map((stage, index) => (
            <li key={`${track.id}:${index}`} className="relative pl-10 sm:pl-12">
              <span aria-hidden="true" className="absolute -bottom-4 left-[11px] top-0 w-0.5 bg-line" />
              <span
                aria-hidden="true"
                className="absolute left-0 top-6 flex size-6 items-center justify-center rounded-full border-2 border-gold bg-canvas font-mono text-[10px] font-semibold text-gold"
              >
                {index}
              </span>
              <div className="rounded-2xl border border-line bg-surface p-5 md:p-7">
                <span className="font-mono text-xs tracking-wide text-muted">{`${labels.stage} ${index}`}</span>
                <h3 className="mt-3 flex flex-wrap items-center gap-2 font-display text-[19px] leading-snug">
                  {stage.title}
                  {stage.ai ? (
                    <span className="rounded-md bg-gold px-1.5 py-0.5 font-mono text-[11px] font-semibold text-on-gold">
                      {labels.ai}
                    </span>
                  ) : null}
                </h3>
                <p className="mt-1 text-sm text-muted">{stage.subtitle}</p>
                <p className="mt-5 font-mono text-xs text-muted">{labels.learn}</p>
                <p className="mt-1.5 max-w-[72ch] leading-relaxed text-ink">{stage.learn}</p>
              </div>
            </li>
          ))}
          <li className="relative pl-10 sm:pl-12">
            <span aria-hidden="true" className="absolute left-0 top-6 size-6 rounded-full border-2 border-gold bg-gold-soft" />
            <div className="rounded-2xl border border-gold/60 bg-gold-soft p-5 md:p-7">
              <h3 className="font-display text-[19px] leading-snug text-gold">{final.title}</h3>
              <p className="mt-2 leading-relaxed text-ink">{final.text}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
