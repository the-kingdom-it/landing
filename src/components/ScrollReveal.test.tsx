import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollReveal } from "./ScrollReveal";

/* В jsdom нет IntersectionObserver и matchMedia — подменяем минимальными заглушками */
type Callback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;
let observerCallback: Callback;
const observed = new Set<Element>();

class FakeObserver {
  constructor(callback: Callback) {
    observerCallback = callback;
  }
  observe(el: Element) {
    observed.add(el);
  }
  unobserve(el: Element) {
    observed.delete(el);
  }
  disconnect() {
    observed.clear();
  }
}

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), media: query }));
}

function setup() {
  document.body.innerHTML = `
    <div id="visible" data-reveal></div>
    <div id="below" data-reveal></div>`;
  const visible = document.getElementById("visible")!;
  const below = document.getElementById("below")!;
  visible.getBoundingClientRect = () => ({ top: 100, bottom: 200 }) as DOMRect;
  below.getBoundingClientRect = () => ({ top: 5000, bottom: 5100 }) as DOMRect;
  return { visible, below };
}

describe("ScrollReveal", () => {
  beforeEach(() => {
    observed.clear();
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.revealReady;
  });

  it("turns reveal mode on and shows elements already on screen right away", () => {
    const { visible, below } = setup();
    render(<ScrollReveal />);
    expect(document.documentElement.dataset.revealReady).toBe("");
    expect(visible.dataset.revealed).toBe("");
    expect(below.dataset.revealed).toBeUndefined();
    expect(observed.has(below)).toBe(true);
    expect(observed.has(visible)).toBe(false);
  });

  it("reveals an element once it scrolls into view and stops watching it", () => {
    const { below } = setup();
    render(<ScrollReveal />);
    act(() => observerCallback([{ isIntersecting: true, target: below }]));
    expect(below.dataset.revealed).toBe("");
    expect(observed.has(below)).toBe(false);
  });

  it("does nothing when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { below } = setup();
    render(<ScrollReveal />);
    expect(document.documentElement.dataset.revealReady).toBeUndefined();
    expect(observed.size).toBe(0);
    expect(below.dataset.revealed).toBeUndefined();
  });
});
