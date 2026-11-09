// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { resolvePhoto } from "./photo";

describe("resolvePhoto", () => {
  let publicDir: string;

  beforeAll(() => {
    publicDir = mkdtempSync(join(tmpdir(), "landing-public-"));
    mkdirSync(join(publicDir, "team"));
    writeFileSync(join(publicDir, "team", "valentin.jpg"), "jpg");
    writeFileSync(join(publicDir, "team", "qa-lead.JPG"), "jpg");
  });

  it("returns null when photo is not set", () => {
    expect(resolvePhoto(null, publicDir)).toBeNull();
  });

  it("returns null when the file is missing in public/", () => {
    expect(resolvePhoto("/team/missing.jpg", publicDir)).toBeNull();
  });

  it("returns the path when the file exists", () => {
    expect(resolvePhoto("/team/valentin.jpg", publicDir)).toBe("/team/valentin.jpg");
  });

  it("treats a file whose name differs only by case as missing", () => {
    // macOS не различает регистр, а nginx на Linux — различает: такой путь даст 404 на проде
    expect(resolvePhoto("/team/qa-lead.jpg", publicDir)).toBeNull();
  });

  it("keeps absolute http(s) URLs as is", () => {
    expect(resolvePhoto("https://cdn.example.com/a.jpg", publicDir)).toBe(
      "https://cdn.example.com/a.jpg",
    );
  });
});
