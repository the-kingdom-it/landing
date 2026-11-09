import { describe, expect, it } from "vitest";
import { readCssVar } from "./css";

describe("readCssVar", () => {
  const css = ":root {\n  --accent: #2B50FF; /* акцент */\n  --accent-strong: color-mix(in srgb, var(--accent), black 14%);\n}";

  it("reads a variable value", () => {
    expect(readCssVar(css, "--accent")).toBe("#2B50FF");
  });

  it("does not confuse a variable with a longer one sharing the prefix", () => {
    expect(readCssVar(":root{--accent-strong: red; --accent: blue;}", "--accent")).toBe("blue");
  });

  it("returns null for a missing variable", () => {
    expect(readCssVar(css, "--missing")).toBeNull();
  });
});
