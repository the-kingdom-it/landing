import { describe, expect, it } from "vitest";
import { buildFaviconSvg } from "./favicon";

describe("buildFaviconSvg", () => {
  const svg = buildFaviconSvg("ВВ", "#2B50FF");

  it("is an svg document", () => {
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("uses the given color as the square fill", () => {
    expect(svg).toContain('fill="#2B50FF"');
  });

  it("renders the initials", () => {
    expect(svg).toContain(">ВВ<");
  });

  it("escapes markup in initials", () => {
    expect(buildFaviconSvg("<b>", "#000")).toContain("&lt;b&gt;");
  });
});
