import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { particleCount } from "@/lib/particles";
import { Particles } from "./Particles";

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), media: query }));
}

describe("Particles", () => {
  beforeEach(() => {
    document.documentElement.dataset.season = "winter";
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.season;
  });

  it("renders snow for the season set on <html>", () => {
    const { container } = render(<Particles />);
    const layer = container.querySelector(".particles");
    expect(layer).toHaveClass("particles--winter");
    expect(container.querySelectorAll(".particle")).toHaveLength(particleCount("winter", window.innerWidth < 768));
  });

  it("splits particles into a back layer behind the glass and a front layer over the content", () => {
    const { container } = render(<Particles />);
    const back = container.querySelectorAll(".particles--back .particle").length;
    const front = container.querySelectorAll(".particles--front .particle").length;
    expect(back).toBeGreaterThan(front);
    expect(front).toBeGreaterThan(0);
    expect(container.querySelector(".particles--front")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<Particles />);
    expect(container.querySelector(".particles")).toBeNull();
  });
});
