import { describe, expect, it } from "vitest";
import { getInitials } from "./initials";

describe("getInitials", () => {
  it("takes first letters of first and last name", () => {
    expect(getInitials("Валентин Волков")).toBe("ВВ");
  });

  it("ignores square brackets of a placeholder", () => {
    expect(getInitials("[ИМЯ ФАМИЛИЯ]")).toBe("ИФ");
  });

  it("returns a single letter for a single word", () => {
    expect(getInitials("Анна")).toBe("А");
  });

  it("uppercases and ignores extra whitespace", () => {
    expect(getInitials("  анна   петрова  ")).toBe("АП");
  });
});
