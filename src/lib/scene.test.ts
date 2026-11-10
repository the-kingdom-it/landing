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
});
