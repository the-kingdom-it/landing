import { describe, expect, it } from "vitest";
import { toUrl } from "./url";

describe("toUrl", () => {
  it("parses a valid absolute URL", () => {
    expect(toUrl("https://example.com")?.origin).toBe("https://example.com");
  });

  it("returns undefined for a bracketed placeholder", () => {
    expect(toUrl("[https://ваш-домен.ru]")).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(toUrl("")).toBeUndefined();
  });
});
