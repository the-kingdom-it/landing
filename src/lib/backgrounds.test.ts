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

const config: SceneConfig = { theme: "light", background: "12", forcedBg: null };

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
  it("uses the main background in the default style", () => {
    expect(resolveScene(config, {})).toEqual({ theme: "light", bg: "12", preview: false });
  });

  it("remembers the visitor's style on the main background", () => {
    expect(resolveScene(config, { stored: "dark" })).toEqual({ theme: "dark", bg: "12", preview: false });
    expect(resolveScene(config, { stored: "pink" })).toEqual({ theme: "light", bg: "12", preview: false });
  });

  it("?theme= wins over the remembered choice", () => {
    expect(resolveScene(config, { theme: "light", stored: "dark" })).toEqual({ theme: "light", bg: "12", preview: false });
  });

  it("?bg= previews another background in its own style, ignoring the remembered choice", () => {
    expect(resolveScene(config, { bg: "9", stored: "dark" })).toEqual({ theme: "light", bg: "9", preview: true });
    expect(resolveScene(config, { bg: "3" })).toEqual({ theme: "dark", bg: "3", preview: true });
    expect(resolveScene(config, { bg: "3", theme: "light" })).toEqual({ theme: "light", bg: "3", preview: true });
  });

  it("?bg= with the main background is not a preview", () => {
    expect(resolveScene(config, { bg: "12", stored: "dark" })).toEqual({ theme: "dark", bg: "12", preview: false });
  });

  it("an unknown ?bg= falls back to the main background", () => {
    expect(resolveScene(config, { bg: "zzz" })).toEqual({ theme: "light", bg: "12", preview: false });
  });

  it("a forced background (BG=...) acts like ?bg=", () => {
    expect(resolveScene({ ...config, forcedBg: "kingdom" }, {})).toEqual({ theme: "dark", bg: "kingdom", preview: true });
  });
});

describe("dark variants", () => {
  it("only the main paper background has a dark variant", () => {
    expect(BACKGROUNDS.filter((bg) => "darkVariant" in bg && bg.darkVariant).map((bg) => bg.id)).toEqual(["12"]);
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
    const d = document.documentElement.dataset;
    return { theme: d.theme, bg: d.bg, preview: "preview" in d };
  };

  afterEach(() => {
    delete document.documentElement.dataset.preview;
  });

  it("applies the default style and background", () => {
    expect(run()).toEqual({ theme: "light", bg: "12", preview: false });
  });

  it("applies the remembered style on the main background", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(run()).toEqual({ theme: "dark", bg: "12", preview: false });
  });

  it("marks a ?bg= preview and applies ?theme=", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.history.replaceState(null, "", "/?bg=9");
    expect(run()).toEqual({ theme: "light", bg: "9", preview: true });
    window.history.replaceState(null, "", "/?bg=9&theme=dark");
    expect(run()).toEqual({ theme: "dark", bg: "9", preview: true });
  });
});
