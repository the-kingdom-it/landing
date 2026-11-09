// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { readCssVar } from "@/lib/css";
import { GET } from "./route";

describe("GET /favicon.svg", () => {
  it("returns an svg with initials from content and the accent from globals.css", async () => {
    const accent = readCssVar(readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8"), "--accent");
    const response = GET();
    const body = await response.text();
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(body).toContain(`>${content.brand.initials}<`);
    expect(body).toContain(`fill="${accent}"`);
  });
});
