function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SVG-иконка сайта: скруглённый квадрат цвета акцента с инициалами. */
export function buildFaviconSvg(initials: string, color: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">`,
    `<rect width="64" height="64" rx="14" fill="${escapeXml(color)}"/>`,
    `<text x="32" y="33" text-anchor="middle" dominant-baseline="central"`,
    ` font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700"`,
    ` letter-spacing="-1" fill="#FFFFFF">${escapeXml(initials)}</text>`,
    `</svg>`,
  ].join("");
}
