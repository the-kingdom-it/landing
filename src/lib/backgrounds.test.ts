import { afterEach, describe, expect, it } from "vitest";
import {
  BACKGROUNDS,
  backgroundTheme,
  buildBackgroundScript,
  resolveBackground,
  resolveScene,
  THEME_STORAGE_KEY,
  type SceneConfig,
} from "./backgrounds";

const config: SceneConfig = { theme: "light", backgrounds: { light: "12", dark: "7" }, forcedBg: null };

describe("resolveBackground", () => {
  it("keeps the kingdom scene for unknown values and accepts numbered ones", () => {
    expect(resolveBackground("99")).toBe("kingdom");
    expect(resolveBackground(undefined)).toBe("kingdom");
    expect(resolveBackground("17")).toBe("17");
  });

  it("offers the kingdom scene plus 17 numbered backgrounds", () => {
    expect(BACKGROUNDS[0].id).toBe("kingdom");
    expect(BACKGROUNDS.map((bg) => bg.id).slice(1)).toEqual(Array.from({ length: 17 }, (_, i) => String(i + 1)));
  });

  it("knows which style suits each background", () => {
    expect(backgroundTheme("12")).toBe("light");
    expect(backgroundTheme("7")).toBe("dark");
    expect(backgroundTheme("kingdom")).toBe("dark");
  });
});

describe("resolveScene", () => {
  it("uses the default style and its background", () => {
    expect(resolveScene(config, {})).toEqual({ theme: "light", bg: "12" });
  });

  it("remembers the visitor's choice", () => {
    expect(resolveScene(config, { stored: "dark" })).toEqual({ theme: "dark", bg: "7" });
    expect(resolveScene(config, { stored: "pink" })).toEqual({ theme: "light", bg: "12" });
  });

  it("?theme= wins over the remembered choice", () => {
    expect(resolveScene(config, { theme: "light", stored: "dark" })).toEqual({ theme: "light", bg: "12" });
  });

  it("?bg= shows that background in its own style, ignoring the remembered choice", () => {
    expect(resolveScene(config, { bg: "9", stored: "dark" })).toEqual({ theme: "light", bg: "9" });
    expect(resolveScene(config, { bg: "3" })).toEqual({ theme: "dark", bg: "3" });
    expect(resolveScene(config, { bg: "3", theme: "light" })).toEqual({ theme: "light", bg: "3" });
  });

  it("an unknown ?bg= falls back to the normal behaviour", () => {
    expect(resolveScene(config, { bg: "zzz" })).toEqual({ theme: "light", bg: "12" });
  });

  it("a forced background (BG=...) acts like ?bg=", () => {
    expect(resolveScene({ ...config, forcedBg: "kingdom" }, {})).toEqual({ theme: "dark", bg: "kingdom" });
  });
});

describe("buildBackgroundScript", () => {
  afterEach(() => {
    delete document.documentElement.dataset.bg;
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  const run = () => {
    new Function(buildBackgroundScript(config))();
    return { theme: document.documentElement.dataset.theme, bg: document.documentElement.dataset.bg };
  };

  it("applies the default style and background", () => {
    expect(run()).toEqual({ theme: "light", bg: "12" });
  });

  it("applies the remembered style", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(run()).toEqual({ theme: "dark", bg: "7" });
  });

  it("applies ?bg= and ?theme= from the address", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.history.replaceState(null, "", "/?bg=9");
    expect(run()).toEqual({ theme: "light", bg: "9" });
    window.history.replaceState(null, "", "/?bg=9&theme=dark");
    expect(run()).toEqual({ theme: "dark", bg: "9" });
  });
});
