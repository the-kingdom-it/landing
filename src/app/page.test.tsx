import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import Home from "./page";

describe("landing page", () => {
  it("renders the hero title as the only h1", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(content.hero.title);
  });

  it("every in-page link points to an element rendered on the page", () => {
    // Убрал секцию из массива в page.tsx — этот тест покажет ссылки, которые на неё вели
    const { container } = render(<Home />);
    const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    expect(anchors.length).toBeGreaterThan(0);
    const dead = anchors
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => !container.querySelector(`[id="${href.slice(1)}"]`));
    expect(dead).toEqual([]);
  });

  it("gives every section an anchor id", () => {
    const { container } = render(<Home />);
    for (const section of container.querySelectorAll("main > section")) {
      expect(section.id).not.toBe("");
    }
  });

  it("renders header navigation from content", () => {
    render(<Home />);
    const nav = screen.getByRole("navigation", { name: content.ui.navLabel });
    for (const item of content.header.nav) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
    expect(screen.getByRole("link", { name: content.header.cta.label })).toHaveAttribute("href", content.header.cta.href);
  });

  it("renders the hero report with computed progress", () => {
    render(<Home />);
    const passed = content.hero.report.steps.filter((step) => step.passed).length;
    const total = content.hero.report.steps.length;
    expect(screen.getByText(`${passed} / ${total} ${content.hero.report.passedLabel}`)).toBeInTheDocument();
  });

  it("renders FAQ as native details/summary", () => {
    const { container } = render(<Home />);
    const details = container.querySelectorAll(`#${content.faq.id} details`);
    expect(details).toHaveLength(content.faq.items.length);
    details.forEach((item, index) => {
      expect(item.querySelector("summary")).toHaveTextContent(content.faq.items[index].question);
    });
  });

  it("shows initials placeholders when team photo files are missing", () => {
    render(<Home />);
    for (const member of content.team.members) {
      expect(screen.getByRole("img", { name: member.photoAlt })).toBeInTheDocument();
    }
  });

  it("links the CTA button to Telegram in a new tab and shows the handle", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: content.cta.button.label });
    expect(link).toHaveAttribute("href", content.cta.button.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText(content.cta.handle)).toBeInTheDocument();
  });

  it("renders pricing amounts and the referral offer", () => {
    render(<Home />);
    expect(screen.getByText(content.pricing.start.amount)).toBeInTheDocument();
    expect(screen.getByText(content.pricing.afterOffer.amount)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: content.referral.title })).toBeInTheDocument();
  });

  it("renders the footer with the current year and legal placeholder", () => {
    render(<Home />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(String(new Date().getFullYear()));
    expect(footer).toHaveTextContent(content.footer.legal);
  });
});
