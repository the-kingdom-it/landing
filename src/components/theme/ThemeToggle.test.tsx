import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/backgrounds";
import { ThemeToggle } from "./ThemeToggle";

const labels = { toDark: "Включить тёмную тему", toLight: "Включить светлую тему" };
const backgrounds = { light: "12", dark: "7" } as const;

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.bg = "12";
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.bg;
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("switches to the dark style with its background and remembers it", () => {
    render(<ThemeToggle labels={labels} backgrounds={backgrounds} />);
    fireEvent.click(screen.getByRole("button", { name: /тёмную/ }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.bg).toBe("7");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("switches back to the light style", () => {
    render(<ThemeToggle labels={labels} backgrounds={backgrounds} />);
    const button = screen.getByRole("button", { name: /тёмную/ });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.bg).toBe("12");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("keeps the background from ?bg= and changes only the style", () => {
    window.history.replaceState(null, "", "/?bg=9");
    document.documentElement.dataset.bg = "9";
    render(<ThemeToggle labels={labels} backgrounds={backgrounds} />);
    fireEvent.click(screen.getByRole("button", { name: /тёмную/ }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.bg).toBe("9");
  });
});
