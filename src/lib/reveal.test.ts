import { describe, expect, it } from "vitest";
import { revealProps } from "./reveal";

describe("revealProps", () => {
  it("marks the element for scroll reveal without delay by default", () => {
    expect(revealProps()).toEqual({ "data-reveal": "", style: { "--reveal-delay": "0ms" } });
  });

  it("staggers items by their index", () => {
    expect(revealProps(2).style).toEqual({ "--reveal-delay": "180ms" });
  });

  it("caps the delay so long lists do not wait too long", () => {
    expect(revealProps(40).style).toEqual({ "--reveal-delay": "450ms" });
  });
});

describe("motionDelay", () => {
  it("sets the animation delay variable", async () => {
    const { motionDelay } = await import("./reveal");
    expect(motionDelay(150)).toEqual({ "--delay": "150ms" });
  });
});
