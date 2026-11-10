/**
 * Выделение слов в заголовке первого экрана (QA, AQA). Стиль выбирается через ?title=N
 * или content.hero.titleStyle; сами стили — блок «ЗАГОЛОВОК» в globals.css.
 */
export const TITLE_STYLES = [
  { id: "0", name: "Без выделения" },
  { id: "1", name: "Цвет акцента" },
  { id: "2", name: "Градиент" },
  { id: "3", name: "Маркер" },
  { id: "4", name: "Рукописное подчёркивание" },
  { id: "5", name: "Прописью" },
  { id: "6", name: "Курсив с засечками" },
  { id: "7", name: "Код-плашка" },
  { id: "8", name: "Контур" },
  { id: "9", name: "Обведено от руки" },
] as const;

export type TitleStyleId = (typeof TITLE_STYLES)[number]["id"];

/** prefix — слово, приклеенное к выделенному неразрывным пробелом («в\u00a0»): переносится вместе с ним. */
export type TitlePart = { text: string; mark: boolean; prefix?: string };

/** Делит заголовок на части и помечает выделяемые слова (только целые слова, «QA» внутри «AQA» не трогает). */
export function splitTitle(title: string, words: readonly string[]): TitlePart[] {
  if (words.length === 0) return [{ text: title, mark: false }];
  const escaped = [...words].sort((a, b) => b.length - a.length).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join("|")})(?![\\p{L}\\p{N}])`, "gu");
  const parts: TitlePart[] = [];
  let last = 0;
  for (const match of title.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: title.slice(last, start), mark: false });
    parts.push({ text: match[0], mark: true });
    last = start + match[0].length;
  }
  if (last < title.length) parts.push({ text: title.slice(last), mark: false });

  // предлог с неразрывным пробелом перед выделенным словом переносим в его prefix
  for (let i = 1; i < parts.length; i++) {
    const previous = parts[i - 1];
    if (!parts[i].mark || previous.mark) continue;
    const glued = previous.text.match(/\S+\u00a0$/);
    if (!glued) continue;
    parts[i] = { ...parts[i], prefix: glued[0] };
    previous.text = previous.text.slice(0, -glued[0].length);
  }
  return parts.filter((part) => part.text !== "" || part.mark);
}

/** Скрипт для <head>: ставит <html data-title> до первой отрисовки (?title=3 в адресе переключает стиль). */
export function buildTitleScript(defaultStyle: string): string {
  const ids = JSON.stringify(TITLE_STYLES.map((style) => style.id));
  return `(function(){try{var s=${ids},q=new URLSearchParams(location.search).get("title");document.documentElement.dataset.title=s.indexOf(q)>=0?q:${JSON.stringify(defaultStyle)}}catch(e){}})()`;
}
