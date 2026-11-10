import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { content } from "@/content";
import { RoadmapTabs } from "./RoadmapTabs";

const { tracks, labels, statuses, final } = content.roadmap;

function renderTabs() {
  return render(<RoadmapTabs tracks={tracks} labels={labels} statuses={statuses} final={final} />);
}

describe("RoadmapTabs", () => {
  it("renders a tab per track with the first one selected", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(tracks.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByText(tracks[0].goal)).toBeInTheDocument();
    for (const stage of tracks[0].stages) expect(within(panel).getByText(stage.title)).toBeInTheDocument();
  });

  it("switches the track on click", () => {
    renderTabs();
    fireEvent.click(screen.getAllByRole("tab")[1]);
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByRole("tabpanel")).getByText(tracks[1].goal)).toBeInTheDocument();
  });

  it("moves between tabs with arrow keys", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(screen.getAllByRole("tab")[1]);
    fireEvent.keyDown(screen.getAllByRole("tab")[1], { key: "End" });
    expect(screen.getAllByRole("tab")[tracks.length - 1]).toHaveAttribute("aria-selected", "true");
  });

  it("marks AI chapters", () => {
    renderTabs();
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByText(labels.ai)).toHaveLength(tracks[0].stages.filter((stage) => stage.ai).length);
  });

  it("shows every stage as passed when scroll animation is unavailable", () => {
    renderTabs();
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByText(statuses.passed)).toHaveLength(tracks[0].stages.length);
    expect(within(panel).getByText(final.title)).toBeInTheDocument();
  });

  describe("with scroll animation", () => {
    type Callback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;
    let fire: Callback;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(callback: Callback) {
            fire = callback;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it("runs a stage when it scrolls into view: pending → running → passed", () => {
      const { container } = renderTabs();
      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getAllByText(statuses.pending)).toHaveLength(tracks[0].stages.length);
      const first = container.querySelector("[data-stage]")!;
      act(() => fire([{ isIntersecting: true, target: first }]));
      expect(within(first as HTMLElement).getByText(statuses.running)).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1000));
      expect(within(first as HTMLElement).getByText(statuses.passed)).toBeInTheDocument();
    });
  });
});
