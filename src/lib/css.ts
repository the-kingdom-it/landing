/** Достаёт значение CSS-переменной из текста стилей: readCssVar(css, "--accent") → "#2b50ff". */
export function readCssVar(css: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*:\\s*([^;]+);`));
  return match ? match[1].trim() : null;
}
