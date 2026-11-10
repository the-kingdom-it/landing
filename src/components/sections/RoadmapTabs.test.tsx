import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { RoadmapTabs } from "./RoadmapTabs";

const { tracks, labels, final } = content.roadmap;

function renderTabs(art: "mesh" | "outline" | "off" = "off") {
  return render(<RoadmapTabs tracks={tracks} labels={labels} final={final} art={art} />);
}

describe("RoadmapTabs", () => {
  it("renders a tab per track with the first one selected", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(tracks.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    tabs.forEach((tab, index) => expect(tab.textContent).toBe(tracks[index].title));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByText(tracks[0].goal)).toBeInTheDocument();
    for (const stage of tracks[0].stages) {
      expect(within(panel).getByText(stage.title)).toBeInTheDocument();
      expect(within(panel).getByText(stage.learn)).toBeInTheDocument();
    }
    expect(within(panel).getByText(final.title)).toBeInTheDocument();
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

  it("shows no run statuses and no result block", () => {
    renderTabs();
    const panel = screen.getByRole("tabpanel");
    for (const status of ["PENDING", "RUNNING", "PASSED", "NEXT"]) {
      expect(within(panel).queryByText(status)).toBeNull();
    }
    expect(within(panel).queryByText("на выходе")).toBeNull();
  });

  it("draws a decorative picture for every stage when pictures are on", () => {
    const { container } = renderTabs("mesh");
    const pictures = container.querySelectorAll("svg[data-art]");
    expect(pictures).toHaveLength(tracks[0].stages.length);
    pictures.forEach((svg, index) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("data-art", tracks[0].stages[index].art);
    });
    expect(container.querySelector("[data-art-style]")).toHaveAttribute("data-art-style", "mesh");
  });

  it("shows no pictures when they are off", () => {
    const { container } = renderTabs("off");
    expect(container.querySelectorAll("svg[data-art]")).toHaveLength(0);
  });
});
