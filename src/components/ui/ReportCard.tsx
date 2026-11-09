import type { SiteContent } from "@/content";
import { Icon } from "./Icon";

type ReportCardProps = {
  report: SiteContent["hero"]["report"];
};

/** Карточка в стиле Allure-отчёта: шаги пути к офферу. */
export function ReportCard({ report }: ReportCardProps) {
  const total = report.steps.length;
  const passed = report.steps.filter((step) => step.passed).length;
  const percent = total === 0 ? 0 : Math.round((passed / total) * 100);

  return (
    <div className="w-full rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <span className="flex min-w-0 items-center gap-2 font-mono text-sm text-ink">
          <Icon name="file" className="size-4 shrink-0 text-muted" />
          <span className="truncate">{report.fileName}</span>
        </span>
        <span className="rounded-full bg-passed-soft px-2.5 py-1 font-mono text-xs font-medium text-passed">
          {`${passed} / ${total} ${report.passedLabel}`}
        </span>
      </div>

      <div className="px-5 pt-5">
        <div
          role="progressbar"
          aria-label={report.progressLabel}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={passed}
          className="h-2 overflow-hidden rounded-full bg-canvas"
        >
          <div className="h-full rounded-full bg-passed" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className="px-2 pb-3 pt-3">
        {report.steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            {step.passed ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-passed text-on-accent">
                <Icon name="check" className="size-3.5" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="size-6 shrink-0 rounded-full border-2 border-accent" aria-hidden="true" />
            )}
            <span className={`text-[15px] ${step.passed ? "text-ink" : "font-semibold text-accent"}`}>
              {step.label}
            </span>
            <span className="sr-only">{step.passed ? report.statusPassed : report.statusPending}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
