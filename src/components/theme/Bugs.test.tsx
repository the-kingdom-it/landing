import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Bugs, isBugUncovered } from "./Bugs";

function mockMedia({ reduce = false, fine = true } = {}) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: (query.includes("reduce") && reduce) || (query.includes("pointer: fine") && fine),
    media: query,
  }));
}

const reward = {
  goal: 2,
  title: "Скидка получена",
  codeLabel: "промокод",
  linkLabel: "Писать сюда",
  href: "https://t.me/SadLiter",
};

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
    const { container, unmount } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(100));
    expect(container.querySelectorAll("[data-bug]").length).toBeGreaterThan(0);
    expect(document.documentElement.dataset.bugs).toBe("");
    unmount();
    expect(document.documentElement.dataset.bugs).toBeUndefined();
  });

  it("catches a bug on click and shows the counter", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.pointerDown(container.querySelector("[data-bug]")!);
    expect(screen.getByRole("status")).toHaveTextContent("поймано багов: 1");
  });

  it("keeps a caught bug where it was caught while the catch animation plays", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(100));
    const bug = container.querySelector<HTMLElement>("[data-bug]")!;
    const before = bug.style.transform;
    expect(before).not.toBe("");
    fireEvent.pointerDown(bug);
    expect(bug).toHaveClass("bug--caught");
    expect(bug.style.transform).toBe(before);
  });

  it("replaces the counter with a promo code and a link once enough bugs are caught", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(3000));
    const bugs = container.querySelectorAll("[data-bug]");
    expect(bugs.length).toBeGreaterThanOrEqual(2);
    fireEvent.pointerDown(bugs[0]);
    expect(screen.getByRole("status")).toHaveTextContent("поймано багов: 1");
    fireEvent.pointerDown(bugs[1]);
    const status = screen.getByRole("status");
    expect(status).not.toHaveTextContent("поймано багов");
    expect(status).toHaveTextContent(reward.title);
    expect(status.textContent).toMatch(/промокод\s*\d{6}/);
    const link = screen.getByRole("link", { name: reward.linkLabel });
    expect(link).toHaveAttribute("href", reward.href);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("after the reward the remaining bugs scatter, ignore clicks, stop spawning and the cursor is normal again", () => {
    const { container } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(3000));
    const bugs = Array.from(container.querySelectorAll("[data-bug]"));
    expect(bugs.length).toBeGreaterThanOrEqual(3);
    fireEvent.pointerDown(bugs[0]);
    fireEvent.pointerDown(bugs[1]);
    expect(document.documentElement.dataset.bugs).toBeUndefined();
    const left = bugs[2];
    expect(left).toHaveClass("bug--scatter");
    const before = screen.getByRole("status").textContent;
    fireEvent.pointerDown(left);
    expect(screen.getByRole("status").textContent).toBe(before);
    act(() => vi.advanceTimersByTime(20000));
    const fresh = Array.from(container.querySelectorAll("[data-bug]")).filter((bug) => !bugs.includes(bug));
    expect(fresh).toHaveLength(0);
  });

  it("stays away when the user prefers reduced motion", () => {
    mockMedia({ reduce: true });
    const { container } = render(<Bugs counterLabel="поймано багов" reward={reward} />);
    act(() => vi.advanceTimersByTime(5000));
    expect(container.querySelectorAll("[data-bug]")).toHaveLength(0);
    expect(document.documentElement.dataset.bugs).toBeUndefined();
  });
});

describe("isBugUncovered", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is true when the point hits the bug itself", () => {
    const bug = document.createElement("div");
    const part = document.createElement("span");
    bug.appendChild(part);
    document.elementFromPoint = () => part;
    expect(isBugUncovered(bug, { x: 10, y: 10 })).toBe(true);
  });

  it("is false when a panel covers the bug", () => {
    const bug = document.createElement("div");
    const panel = document.createElement("section");
    document.elementFromPoint = () => panel;
    expect(isBugUncovered(bug, { x: 10, y: 10 })).toBe(false);
  });
});
