import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Bugs } from "./Bugs";

function mockMedia({ reduce = false, fine = true } = {}) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: (query.includes("reduce") && reduce) || (query.includes("pointer: fine") && fine),
    media: query,
  }));
}

describe("Bugs", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("lets bugs crawl in and turns on the lens cursor", () => {
    const { container, unmount } = render(<Bugs counterLabel="поймано багов" />);
    act(() => vi.advanceTimersByTime(100));
    expect(container.querySelectorAll("[data-bug]").length).toBeGreaterThan(0);
    expect(document.documentElement.dataset.bugs).toBe("");
    unmount();
    expect(document.documentElement.dataset.bugs).toBeUndefined();
  });

  it("catches a bug on click and shows the counter", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.pointerDown(container.querySelector("[data-bug]")!);
    expect(screen.getByRole("status")).toHaveTextContent("поймано багов: 1");
  });

  it("keeps a caught bug where it was caught while the catch animation plays", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" />);
    act(() => vi.advanceTimersByTime(100));
    const bug = container.querySelector<HTMLElement>("[data-bug]")!;
    const before = bug.style.transform;
    expect(before).not.toBe("");
    fireEvent.pointerDown(bug);
    expect(bug).toHaveClass("bug--caught");
    expect(bug.style.transform).toBe(before);
  });

  it("stays away when the user prefers reduced motion", () => {
    mockMedia({ reduce: true });
    const { container } = render(<Bugs counterLabel="поймано багов" />);
    act(() => vi.advanceTimersByTime(5000));
    expect(container.querySelectorAll("[data-bug]")).toHaveLength(0);
    expect(document.documentElement.dataset.bugs).toBeUndefined();
  });
});
