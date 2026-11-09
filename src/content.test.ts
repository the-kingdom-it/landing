import { describe, expect, it } from "vitest";
import { content } from "./content";

/*
 * Тесты проверяют структуру контента, а не количество пунктов:
 * добавить вопрос в FAQ или шаг в план можно без правки тестов.
 */

function sectionIds(): string[] {
  return Object.values(content as Record<string, unknown>)
    .filter((value): value is { id: string } => typeof value === "object" && value !== null && "id" in value)
    .map((value) => value.id);
}

describe("content", () => {
  it("hero report has passed steps and ends with the pending step", () => {
    const steps = content.hero.report.steps;
    expect(steps.some((step) => step.passed)).toBe(true);
    expect(steps[steps.length - 1].passed).toBe(false);
  });

  it("lists are not empty", () => {
    expect(content.audience.items.length).toBeGreaterThan(0);
    expect(content.process.steps.length).toBeGreaterThan(0);
    expect(content.team.members.length).toBeGreaterThan(0);
    expect(content.faq.items.length).toBeGreaterThan(0);
    expect(content.header.nav.length).toBeGreaterThan(0);
  });

  it("every in-page link in content points to a section id from content", () => {
    const ids = sectionIds();
    const links = [
      ...content.header.nav,
      content.header.cta,
      content.hero.primaryCta,
      content.hero.secondaryCta,
      content.referral.cta,
    ];
    for (const { href } of links.filter((link) => link.href.startsWith("#"))) {
      expect(ids).toContain(href.slice(1));
    }
  });

  it("section ids are unique", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("team photo is null, a path from public/ or an absolute URL, and always has alt text", () => {
    for (const member of content.team.members) {
      if (member.photo !== null) expect(member.photo).toMatch(/^(\/|https?:\/\/)/);
      expect(member.photoAlt.trim().length).toBeGreaterThan(0);
    }
  });

  it("telegram button links to t.me", () => {
    expect(content.cta.button.href.startsWith("https://t.me/")).toBe(true);
  });
});
