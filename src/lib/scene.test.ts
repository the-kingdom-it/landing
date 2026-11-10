import { describe, expect, it } from "vitest";
import { SEASONS } from "./season";
import { sceneStyles } from "./scene";

describe("sceneStyles", () => {
  it("points every season to its desktop and mobile picture", () => {
    const css = sceneStyles("");
    for (const season of SEASONS) {
      expect(css).toContain(`html[data-season="${season}"]{--scene-image:url("/scene/${season}.webp")}`);
      expect(css).toContain(`html[data-season="${season}"]{--scene-image:url("/scene/${season}-m.webp")}`);
    }
    expect(css).toContain("@media (max-width: 767px)");
  });

  it("adds the base path for a site served from a subfolder", () => {
    expect(sceneStyles("/landing")).toContain('url("/landing/scene/winter.webp")');
  });

  it("lets a numbered background replace the scene, on phones too", () => {
    const css = sceneStyles("/landing");
    const rule = 'html[data-bg="1"]{--scene-image:url("/landing/backgrounds/1.webp")}';
    expect(css).toContain(rule);
    expect(css.indexOf(rule)).toBeGreaterThan(css.lastIndexOf("@media"));
    expect(css).not.toContain('data-bg="kingdom"');
    expect(css).toContain('html[data-bg="17"]{--scene-image:url("/landing/backgrounds/17.webp")}');
  });

  it("softens the overlay for minimalist backgrounds in their own theme only", () => {
    const css = sceneStyles("");
    expect(css).toMatch(/html\[data-bg="2"\]\[data-theme="dark"\]\{--scene-overlay:[^}]+\}/);
    expect(css).toMatch(/html\[data-bg="1"\]\[data-theme="light"\]\{--scene-overlay:[^}]+\}/);
    expect(css).not.toContain('html[data-bg="1"][data-theme="dark"]');
    expect(css).not.toContain('html[data-bg="kingdom"]');
  });
});
