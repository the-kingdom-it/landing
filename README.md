# Лендинг менторства в QA / AQA

Next.js (App Router) + TypeScript + Tailwind CSS v4. Статический экспорт: после сборки в папке `out/`
лежит готовый сайт из HTML, CSS и JS, его можно залить на любой хостинг.

## Быстрый старт

```bash
npm install
npm run dev      # локально: http://localhost:3000
npm test         # тесты (Vitest)
npm run build    # сборка в папку out/
```

Нужен Node.js 20.9 или новее.

## Где что менять

| Что | Где |
| --- | --- |
| Все тексты, цены, ссылки, пункты списков, FAQ, meta и Open Graph | `src/content.ts` |
| Цвета (акцент и остальные) | `src/app/globals.css`, блок `:root` |
| Шрифты | `src/app/fonts.ts` (какие шрифты грузить) и `src/app/globals.css` (`--font-display`, `--font-sans`, `--font-mono`) |
| Фото команды | `public/team/` + поле `photo` в `src/content.ts` (подробности в `public/team/README.txt`) |
| Порядок секций, убрать секцию | массив `sections` в `src/app/page.tsx` |
| Вёрстка отдельной секции | `src/components/sections/<Секция>.tsx` |

### Тексты

Всё в `src/content.ts`, в компонентах текста нет (это проверяет тест). Значения в `[КВАДРАТНЫХ СКОБКАХ]`
нужно заменить перед публикацией. Их легко найти поиском по `[`:

- `[УСЛОВИЯ]` и `[Подробности…]` — постоплата;
- `[ИМЯ ФАМИЛИЯ]` — QA Lead и описание;
- `[ЧАСЫ]` — FAQ;
- `[https://ваш-домен.ru]` — `meta.siteUrl`. Пока здесь плейсхолдер, `og:url` и `og:image` не выводятся.

Картинка для соцсетей: положи `public/og.png` (1200×630) и укажи `ogImage: "/og.png"`.
Она появится в разметке, когда в `siteUrl` будет настоящий домен.

### Цвета

Акцент меняется в одной строке — `--accent` в `src/app/globals.css`. Оттуда цвет попадает в утилиты
Tailwind (`bg-accent`, `text-accent`), производные оттенки (`--accent-strong`, `--accent-soft`) и favicon.
В Tailwind v4 нет отдельного `tailwind.config`: его роль играет блок `@theme inline` в том же файле.

### Favicon

Генерируется при сборке (`src/app/favicon.svg/route.ts`): инициалы берутся из `content.brand.initials`,
цвет — из `--accent`. Отдельно править не нужно.

### Секции

```tsx
// src/app/page.tsx
const sections = [Hero, Audience, Process, Pricing, Team, Referral, Faq, Cta];
```

Убрать секцию — удали её из массива. Если на неё вели ссылки (меню, кнопки — поиск по `#id` в `content.ts`),
поправь их: `npm test` перечислит все ссылки, которые остались без цели.
Переставить — поменяй элементы местами. Шапка и футер — строки `<Header />` и `<Footer />` там же.

## Деплой

```bash
npm ci
npm run build
```

Залей содержимое папки `out/` на хостинг (любой статический: S3, Netlify, GitHub Pages, обычный веб-сервер).

### VPS + nginx

```bash
rsync -avz --delete out/ user@server:/var/www/mentoring/
```

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    root /var/www/mentoring;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # файлы со хешем в имени можно кешировать навсегда
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /404.html;
}
```

HTTPS удобно получить через certbot: `sudo certbot --nginx -d ваш-домен.ru`.
