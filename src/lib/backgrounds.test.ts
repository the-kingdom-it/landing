import { afterEach, describe, expect, it } from "vitest";
import { BACKGROUNDS, buildBackgroundScript, resolveBackground } from "./backgrounds";

describe("resolveBackground", () => {
  it("keeps the kingdom scene by default and for unknown values", () => {
    expect(resolveBackground("kingdom")).toBe("kingdom");
    expect(resolveBackground("99")).toBe("kingdom");
    expect(resolveBackground(undefined)).toBe("kingdom");
  });

  it("accepts a numbered background", () => {
    expect(resolveBackground("3")).toBe("3");
  });

  it("lets a valid override win and ignores an invalid one", () => {
    expect(resolveBackground("kingdom", "2")).toBe("2");
    expect(resolveBackground("4", "lava")).toBe("4");
  });

  it("offers the kingdom scene plus numbered backgrounds", () => {
    expect(BACKGROUNDS[0]).toBe("kingdom");
    expect(BACKGROUNDS.length).toBeGreaterThan(1);
  });
});

describe("buildBackgroundScript", () => {
  afterEach(() => {
    delete document.documentElement.dataset.bg;
    window.history.replaceState(null, "", "/");
  });

  const run = (script: string) => {
    new Function(script)();
    return document.documentElement.dataset.bg;
  };

  it("sets the default background on <html>", () => {
    expect(run(buildBackgroundScript("kingdom"))).toBe("kingdom");
  });

  it("switches by ?bg= in the address", () => {
    window.history.replaceState(null, "", "/?bg=5");
    expect(run(buildBackgroundScript("kingdom"))).toBe("5");
  });

  it("ignores an unknown ?bg= value", () => {
    window.history.replaceState(null, "", "/?bg=zzz");
    expect(run(buildBackgroundScript("2"))).toBe("2");
  });
});
