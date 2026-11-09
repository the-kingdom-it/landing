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

  it("every section after the hero has elements that appear on scroll", () => {
    const { container } = render(<Home />);
    const sections = Array.from(container.querySelectorAll("main > section")).slice(1);
    for (const section of sections) {
      expect(section.querySelectorAll("[data-reveal]").length, section.id).toBeGreaterThan(0);
    }
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

  it("header logo is the initials square with an accessible home label, without the brand name", () => {
    render(<Home />);
    const banner = screen.getByRole("banner");
    const home = within(banner).getByRole("link", { name: content.ui.homeLabel });
    expect(home).toHaveAttribute("href", `#${content.hero.id}`);
    expect(home).toHaveTextContent(content.brand.initials);
    expect(within(banner).queryByText("Волков · менторство")).toBeNull();
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
    const { container } = render(<Home />);
    const cta = within(container.querySelector<HTMLElement>(`#${content.cta.id}`)!);
    const link = cta.getByRole("link", { name: content.cta.button.label });
    expect(link).toHaveAttribute("href", content.cta.button.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(cta.getByText(content.cta.handle)).toBeInTheDocument();
  });

  it("renders the postpayment card and the referral offer", () => {
    render(<Home />);
    const pricing = screen.getByRole("heading", { name: content.pricing.title }).closest("section")!;
    expect(within(pricing).getByText(content.pricing.postpayment.label)).toBeInTheDocument();
    expect(within(pricing).getByText(content.pricing.postpayment.amount)).toBeInTheDocument();
    const telegram = within(pricing).getByRole("link", { name: content.pricing.postpayment.link!.label });
    expect(telegram).toHaveAttribute("href", content.pricing.postpayment.link!.href);
    expect(telegram).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("heading", { name: content.referral.title })).toBeInTheDocument();
  });

  it("renders the footer with the copyright year and the full name only", () => {
    render(<Home />);
    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent).toBe(`\u00A9 ${new Date().getFullYear()}${content.footer.legal}`);
    expect(footer).toHaveTextContent("Волков Валентин Александрович");
    expect(footer).not.toHaveTextContent("ИНН");
  });

  it("renders the hero without the eyebrow label", () => {
    render(<Home />);
    expect(screen.queryByText("Менторство в QA и автоматизации")).toBeNull();
  });
});
