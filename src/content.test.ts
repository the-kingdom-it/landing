import { describe, expect, it } from "vitest";
import { content } from "./content";

function sectionIds(): string[] {
  return Object.values(content as Record<string, unknown>)
    .filter((value): value is { id: string } => typeof value === "object" && value !== null && "id" in value)
    .map((value) => value.id);
}

describe("content", () => {
  it("hero report has 6 steps: 5 passed and the last one pending", () => {
    const steps = content.hero.report.steps;
    expect(steps).toHaveLength(6);
    expect(steps.filter((step) => step.passed)).toHaveLength(5);
    expect(steps[steps.length - 1].passed).toBe(false);
  });

  it("has 3 audience cards, 6 process steps, 2 pricing cards, 2 team members, 4 FAQ items", () => {
    expect(content.audience.items).toHaveLength(3);
    expect(content.process.steps).toHaveLength(6);
    expect([content.pricing.start, content.pricing.afterOffer]).toHaveLength(2);
    expect(content.team.members).toHaveLength(2);
    expect(content.faq.items).toHaveLength(4);
  });

  it("every header anchor points to an existing section id", () => {
    const ids = sectionIds();
    const anchors = [...content.header.nav, content.header.cta].map((link) => link.href);
    for (const href of anchors) {
      expect(href.startsWith("#")).toBe(true);
      expect(ids).toContain(href.slice(1));
    }
  });

  it("hero buttons and referral button point to existing sections", () => {
    const ids = sectionIds();
    for (const href of [content.hero.primaryCta.href, content.hero.secondaryCta.href, content.referral.cta.href]) {
      expect(ids).toContain(href.slice(1));
    }
  });

  it("section ids are unique", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("team photos point to public/team/", () => {
    for (const member of content.team.members) {
      if (member.photo) expect(member.photo.startsWith("/team/")).toBe(true);
      expect(member.photoAlt.length).toBeGreaterThan(0);
    }
  });

  it("telegram button links to t.me", () => {
    expect(content.cta.button.href.startsWith("https://t.me/")).toBe(true);
  });
});
