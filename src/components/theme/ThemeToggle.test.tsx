import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/backgrounds";
import { ThemeToggle } from "./ThemeToggle";

const labels = { toDark: "Включить тёмную тему", toLight: "Включить светлую тему" };

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.bg = "12";
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.bg;
    window.localStorage.clear();
  });

  it("switches the main background to the dark style and remembers it", () => {
    render(<ThemeToggle labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: /тёмную/ }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.bg).toBe("12");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("switches back to the light style", () => {
    render(<ThemeToggle labels={labels} />);
    const button = screen.getByRole("button", { name: /тёмную/ });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("carries a class that hides it during a background preview", () => {
    render(<ThemeToggle labels={labels} />);
    expect(screen.getByRole("button", { name: /тёмную/ })).toHaveClass("theme-toggle");
  });
});
