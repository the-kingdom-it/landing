import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows initials placeholder when there is no photo", () => {
    const { container } = render(<Avatar src={null} alt="Анна Петрова, QA Lead" initials="АП" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img", { name: "Анна Петрова, QA Lead" })).toHaveTextContent("АП");
  });

  it("renders the photo with a meaningful alt", () => {
    render(<Avatar src="/team/valentin.jpg" alt="Валентин Волков, основатель" initials="ВВ" />);
    const img = screen.getByRole("img", { name: "Валентин Волков, основатель" });
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("src")).toContain("/team/valentin.jpg");
    expect(img).toHaveAttribute("width", "160");
    expect(img).toHaveAttribute("height", "160");
  });
});
