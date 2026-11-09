/** Инициалы для плейсхолдера: «Валентин Волков» → «ВВ», «[ИМЯ ФАМИЛИЯ]» → «ИФ». */
export function getInitials(name: string): string {
  return name
    .replace(/[[\]]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}
