import { afterEach, describe, expect, it } from "vitest";
import { BACKGROUNDS, backgroundTheme, buildBackgroundScript, resolveBackground, resolveTheme } from "./backgrounds";

describe("resolveBackground", () => {
  it("keeps the kingdom scene by default and for unknown values", () => {
    expect(resolveBackground("kingdom")).toBe("kingdom");
    expect(resolveBackground("99")).toBe("kingdom");
    expect(resolveBackground(undefined)).toBe("kingdom");
  });

  it("accepts a numbered background, including the new ones", () => {
    expect(resolveBackground("3")).toBe("3");
    expect(resolveBackground("17")).toBe("17");
  });

  it("lets a valid override win and ignores an invalid one", () => {
    expect(resolveBackground("kingdom", "2")).toBe("2");
    expect(resolveBackground("4", "lava")).toBe("4");
  });

  it("offers the kingdom scene plus 17 numbered backgrounds", () => {
    expect(BACKGROUNDS[0].id).toBe("kingdom");
    expect(BACKGROUNDS.map((bg) => bg.id).slice(1)).toEqual(Array.from({ length: 17 }, (_, i) => String(i + 1)));
  });
});

describe("theme", () => {
  it("light backgrounds prefer the white style, dark ones and the kingdom the dark style", () => {
    expect(backgroundTheme("1")).toBe("light");
    expect(backgroundTheme("2")).toBe("dark");
    expect(backgroundTheme("kingdom")).toBe("dark");
  });

  it("auto follows the background, a fixed setting or a valid override wins", () => {
    expect(resolveTheme("auto", "1")).toBe("light");
    expect(resolveTheme("auto", "2")).toBe("dark");
    expect(resolveTheme("light", "2")).toBe("light");
    expect(resolveTheme("auto", "1", "dark")).toBe("dark");
    expect(resolveTheme("auto", "1", "pink")).toBe("light");
    expect(resolveTheme(undefined, "kingdom")).toBe("dark");
  });
});

describe("buildBackgroundScript", () => {
  afterEach(() => {
    delete document.documentElement.dataset.bg;
    delete document.documentElement.dataset.theme;
    window.history.replaceState(null, "", "/");
  });

  const run = (script: string) => {
    new Function(script)();
    return [document.documentElement.dataset.bg, document.documentElement.dataset.theme];
  };

  it("sets the default background and its theme on <html>", () => {
    expect(run(buildBackgroundScript("kingdom", "auto"))).toEqual(["kingdom", "dark"]);
  });

  it("switches background by ?bg= and picks the matching theme", () => {
    window.history.replaceState(null, "", "/?bg=1");
    expect(run(buildBackgroundScript("kingdom", "auto"))).toEqual(["1", "light"]);
  });

  it("forces the theme by ?theme=", () => {
    window.history.replaceState(null, "", "/?bg=2&theme=light");
    expect(run(buildBackgroundScript("kingdom", "auto"))).toEqual(["2", "light"]);
  });

  it("ignores unknown values", () => {
    window.history.replaceState(null, "", "/?bg=zzz&theme=pink");
    expect(run(buildBackgroundScript("2", "auto"))).toEqual(["2", "dark"]);
  });
});
