// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name) ? [path] : [];
  });
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("copy lives in content.ts", () => {
  const files = [...sourceFiles(join(root, "components")), ...sourceFiles(join(root, "app"))];

  it("finds component files to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.map((file) => [file.replace(root, "src")]))("%s has no hardcoded Cyrillic text", (file) => {
    const code = stripComments(readFileSync(join(root, "..", file), "utf8"));
    expect(code).not.toMatch(/[А-Яа-яЁё]/);
  });

  it("content and components contain no emoji", () => {
    for (const file of [...files, join(root, "content.ts")]) {
      // © и ™ формально пиктограммы, но не эмодзи: ловим только то, что рисуется как эмодзи
      expect(readFileSync(file, "utf8")).not.toMatch(/\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u);
    }
  });
});
