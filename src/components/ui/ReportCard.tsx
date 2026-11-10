import type { CSSProperties } from "react";
import type { SiteContent } from "@/content";
import { motionDelay } from "@/lib/reveal";
import { Icon } from "./Icon";

type ReportCardProps = {
  report: SiteContent["hero"]["report"];
};

/** Когда начинается «прогон» и сколько длится один шаг (секунды). */
const RUN_START = 1.1;
const RUN_STEP = 0.5;

/*
 * Карточка в стиле Allure-отчёта: шаги пути к офферу «прогоняются» как тесты —
 * PENDING → RUNNING → PASSED по очереди, счётчик и полоса растут вместе с ними.
 * Анимация — чистый CSS (блок «ПРОГОН» в globals.css): без JS и при «уменьшить движение»
 * сразу видно итоговое состояние.
 */
export function ReportCard({ report }: ReportCardProps) {
  const total = report.steps.length;
  const passed = report.steps.filter((step) => step.passed).length;
  const percent = total === 0 ? 0 : Math.round((passed / total) * 100);
  const runTime = `${(passed * RUN_STEP).toFixed(2)}s`;
  const runVars = { "--run-start": `${RUN_START}s`, "--run-step": `${RUN_STEP}s` } as CSSProperties;
  let order = 0;

  return (
    <div style={{ ...motionDelay(150), ...runVars }} className="glass motion-rise w-full rounded-[28px] border border-line shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <span className="flex min-w-0 items-center gap-2 font-mono text-sm text-ink">
          <Icon name="file" className="size-4 shrink-0 text-muted" />
          <span className="truncate">{report.fileName}</span>
        </span>
        <span className="rounded-full bg-passed-soft px-2.5 py-1 font-mono text-xs font-medium text-passed-fg">
          <span className="sr-only">{`${passed} / ${total} ${report.passedLabel}`}</span>
          <span aria-hidden="true">
            <span
              className="run-count"
              style={
                {
                  "--count-final": passed,
                  animationDuration: runTime,
                  animationTimingFunction: `steps(${Math.max(passed, 1)}, jump-end)`,
                } as CSSProperties
              }
            />
            {` / ${total} ${report.passedLabel}`}
          </span>
        </span>
      </div>

      <div className="px-5 pt-5">
        <div
          role="progressbar"
          aria-label={report.progressLabel}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={passed}
          className="h-2 overflow-hidden rounded-full bg-white/10"
        >
          <div className="run-bar h-full rounded-full bg-passed" style={{ width: `${percent}%`, animationDuration: runTime }} />
        </div>
      </div>

      <ol className="px-2 pb-3 pt-3">
        {report.steps.map((step, index) => {
          const runIndex = step.passed ? order++ : null;
          return (
            <li
              key={step.label}
              style={{ ...motionDelay(450 + index * 110), ...(runIndex !== null ? { "--i": String(runIndex) } : {}) } as CSSProperties}
              className="motion-rise flex items-center gap-3 rounded-lg px-3 py-2.5"
            >
              {step.passed ? (
                <span aria-hidden="true" className="run-stack size-6 shrink-0">
                  <span className="run-layer run-pending size-6 rounded-full border-2 border-white/25" />
                  <span className="run-layer run-running run-spinner size-6 rounded-full border-2 border-gold border-t-transparent" />
                  <span className="run-layer run-passed run-check flex size-6 items-center justify-center rounded-full bg-passed text-on-accent">
                    <Icon name="check" className="size-3.5" strokeWidth={2.5} />
                  </span>
                </span>
              ) : (
                <span className="run-next-dot size-6 shrink-0 rounded-full border-2 border-gold" aria-hidden="true" />
              )}
              <span className={`min-w-0 flex-1 text-[15px] ${step.passed ? "text-ink" : "font-semibold text-gold"}`}>
                {step.label}
              </span>
              {step.passed ? (
                <span aria-hidden="true" className="run-stack shrink-0 font-mono text-[11px] font-medium tracking-wide">
                  <span className="run-layer run-pending text-muted">{report.runLabels.pending}</span>
                  <span className="run-layer run-running text-gold">{report.runLabels.running}</span>
                  <span className="run-layer run-passed text-passed-fg">{report.runLabels.passed}</span>
                </span>
              ) : (
                <span aria-hidden="true" className="shrink-0 font-mono text-[11px] font-medium tracking-wide text-gold">
                  {report.runLabels.pending}
                </span>
              )}
              <span className="sr-only">{step.passed ? report.statusPassed : report.statusPending}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
