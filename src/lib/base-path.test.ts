import { describe, expect, it } from "vitest";
import { withBasePath } from "./base-path";

describe("withBasePath", () => {
  it("leaves paths untouched without a base path", () => {
    expect(withBasePath("/team/valentin.jpg", "")).toBe("/team/valentin.jpg");
  });

  it("prefixes site paths with the base path (GitHub Pages project site)", () => {
    expect(withBasePath("/team/valentin.jpg", "/landing")).toBe("/landing/team/valentin.jpg");
  });

  it("tolerates a trailing slash in the base path", () => {
    expect(withBasePath("/favicon.svg", "/landing/")).toBe("/landing/favicon.svg");
  });

  it("does not touch absolute URLs and anchors", () => {
    expect(withBasePath("https://t.me/SadLiter", "/landing")).toBe("https://t.me/SadLiter");
    expect(withBasePath("#roadmap", "/landing")).toBe("#roadmap");
  });
});
