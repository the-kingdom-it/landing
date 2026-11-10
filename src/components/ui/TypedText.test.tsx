import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypedText } from "./TypedText";

type Callback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;
let fire: Callback;
const observers: Callback[] = [];

function stubMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), media: query }));
}

describe("TypedText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: Callback) {
          fire = callback;
          observers.push(callback);
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
    observers.length = 0;
  });

  it("always gives screen readers the full text", () => {
    stubMotion(false);
    render(<TypedText text="AQA Engineer" />);
    expect(screen.getByText("AQA Engineer", { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("types the text letter by letter once it scrolls into view", () => {
    stubMotion(false);
    const { container } = render(<TypedText text="AQA Lead" />);
    const typed = container.querySelector("[data-typed]")!;
    expect(typed.textContent).toBe("");
    act(() => fire([{ isIntersecting: true, target: container.firstElementChild! }]));
    act(() => vi.advanceTimersByTime(600));
    expect(typed.textContent!.length).toBeGreaterThan(0);
    expect(typed.textContent!.length).toBeLessThan("AQA Lead".length);
    act(() => vi.advanceTimersByTime(3000));
    expect(typed.textContent).toBe("AQA Lead");
  });

  it("shows the full text at once when the user prefers reduced motion", () => {
    stubMotion(true);
    const { container } = render(<TypedText text="AQA Lead" />);
    expect(container.querySelector("[data-typed]")!.textContent).toBe("AQA Lead");
  });

  it("types a group one after another: the second waits until the first is done", async () => {
    stubMotion(false);
    const { container } = render(
      <>
        <TypedText text="AQA Engineer" queue={{ group: "team-test", index: 0 }} />
        <TypedText text="AQA Lead" queue={{ group: "team-test", index: 1 }} />
      </>,
    );
    const [first, second] = [...container.querySelectorAll("[data-typed]")];
    const nodes = [...container.querySelectorAll(".typed")];
    act(() => observers.forEach((cb, i) => cb([{ isIntersecting: true, target: nodes[i] }])));
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(first.textContent!.length).toBeGreaterThan(0);
    expect(second.textContent).toBe("");
    await act(() => vi.advanceTimersByTimeAsync(1100));
    expect(first.textContent).toBe("AQA Engineer");
    expect(second.textContent!.length).toBeGreaterThan(0);
    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(second.textContent).toBe("AQA Lead");
  });
});
