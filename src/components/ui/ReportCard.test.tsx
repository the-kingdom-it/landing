import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { ReportCard } from "./ReportCard";

const report = {
  ...content.hero.report,
  steps: [
    { label: "Шаг 1", passed: true },
    { label: "Шаг 2", passed: true },
    { label: "Шаг 3", passed: false },
  ],
};

describe("ReportCard", () => {
  it("shows the file name", () => {
    render(<ReportCard report={report} />);
    expect(screen.getByText(report.fileName)).toBeInTheDocument();
  });

  it("computes the passed badge from steps", () => {
    render(<ReportCard report={report} />);
    expect(screen.getByText(`2 / 3 ${report.passedLabel}`)).toBeInTheDocument();
  });

  it("exposes progress as an accessible progressbar", () => {
    render(<ReportCard report={report} />);
    const bar = screen.getByRole("progressbar", { name: report.progressLabel });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "3");
  });

  it("marks each step with its status for screen readers", () => {
    render(<ReportCard report={report} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText(report.statusPassed)).toBeInTheDocument();
    expect(within(items[2]).getByText(report.statusPending)).toBeInTheDocument();
  });
});
