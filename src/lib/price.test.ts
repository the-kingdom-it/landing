import { describe, expect, it } from "vitest";
import { discountPercent } from "./price";

describe("discountPercent", () => {
  it("is 50 for 2 000 instead of 4 000 and for 2 500 instead of 5 000", () => {
    expect(discountPercent("2 000 ₽", "4 000 ₽")).toBe(50);
    expect(discountPercent("2 500 ₽", "5 000 ₽")).toBe(50);
  });

  it("rounds down, so the badge never promises more than the real discount", () => {
    expect(discountPercent("2 010 ₽", "4 000 ₽")).toBe(49);
    expect(discountPercent("2 000 ₽", "3 000 ₽")).toBe(33);
  });

  it("reads only the digits, whatever the spaces and currency sign", () => {
    expect(discountPercent(`3${String.fromCharCode(0xa0)}000${String.fromCharCode(0xa0)}₽`, "4000 руб.")).toBe(25);
  });

  it("is null when there is no real discount or a price has no digits", () => {
    expect(discountPercent("4 000 ₽", "4 000 ₽")).toBeNull();
    expect(discountPercent("5 000 ₽", "4 000 ₽")).toBeNull();
    expect(discountPercent("2 000 ₽", "0 ₽")).toBeNull();
    expect(discountPercent("2 000 ₽", "дорого")).toBeNull();
    expect(discountPercent("Бесплатно", "4 000 ₽")).toBeNull();
  });
});
