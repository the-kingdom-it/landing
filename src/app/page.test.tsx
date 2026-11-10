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

  it("header shows the Kingdom IT wordmark linking to the top, without the initials square", () => {
    render(<Home />);
    const banner = screen.getByRole("banner");
    const home = within(banner).getByRole("link", { name: "Kingdom IT" });
    expect(home).toHaveAttribute("href", `#${content.hero.id}`);
    expect(within(banner).queryByText(content.brand.initials)).toBeNull();
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

  it("renders links inside FAQ answers and opens them in a new tab", () => {
    const { container } = render(<Home />);
    const faq = within(container.querySelector<HTMLElement>(`#${content.faq.id}`)!);
    const withLinks = content.faq.items.filter((item) => item.link);
    expect(withLinks.length).toBeGreaterThan(0);
    for (const item of withLinks) {
      const anchor = faq.getByRole("link", { name: item.link!.label });
      expect(anchor).toHaveAttribute("href", item.link!.href);
      expect(anchor).toHaveAttribute("target", "_blank");
    }
  });

  it("shows initials placeholders when team photo files are missing", () => {
    render(<Home />);
    for (const member of content.team.members) {
      expect(screen.getByRole("img", { name: member.photoAlt })).toBeInTheDocument();
    }
  });

  it("links each team member to their Telegram in a new tab", () => {
    const { container } = render(<Home />);
    const team = within(container.querySelector<HTMLElement>(`#${content.team.id}`)!);
    for (const member of content.team.members) {
      for (const link of member.links) {
        const anchor = team.getByRole("link", { name: link.label });
        expect(anchor).toHaveAttribute("href", link.href);
        expect(anchor).toHaveAttribute("target", "_blank");
      }
    }
    const hrefs = content.team.members.flatMap((member) => member.links.map((link) => link.href));
    expect(hrefs).toEqual(expect.arrayContaining(["https://t.me/different_it", "https://t.me/praleksander"]));
  });

  it("shows the company badge only for members who have one", () => {
    const { container } = render(<Home />);
    const cards = Array.from(container.querySelector(`#${content.team.id} ul`)!.children);
    expect(cards).toHaveLength(content.team.members.length);
    content.team.members.forEach((member, index) => {
      const card = cards[index] as HTMLElement;
      if (member.company) {
        expect(within(card).getByText(member.company.name)).toBeInTheDocument();
        expect(card.querySelector(`img[src*="${member.company.logo}"]`)).not.toBeNull();
      } else {
        expect(card.querySelector("[data-company]")).toBeNull();
      }
    });
    expect(content.team.members.some((member) => member.company)).toBe(true);
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

  it("hints about the bugs under the hero buttons", () => {
    render(<Home />);
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    expect(within(hero).getByText(content.bugs!.hint)).toBeInTheDocument();
  });

  it("renders the hero without the eyebrow label", () => {
    render(<Home />);
    expect(screen.queryByText("Менторство в QA и автоматизации")).toBeNull();
  });
});
