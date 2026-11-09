/*
 * ВЕСЬ ТЕКСТ САЙТА – ЗДЕСЬ.
 *
 * Меняй строки, цены, ссылки и списки прямо в этом файле: компоненты только выводят их.
 * Значения в [КВАДРАТНЫХ СКОБКАХ] – плейсхолдеры, их нужно заменить перед публикацией.
 * Поле `id` у секции – это якорь в адресе (#process). Если меняешь id, поправь ссылки в header.nav.
 */

export type LinkItem = {
  label: string;
  href: string;
};

/** Иконки, доступные для карточек «Кому подойдёт». */
export type AudienceIcon = "compass" | "code" | "trending-up";

export type ReportStep = {
  label: string;
  passed: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  /** Технологии – выводятся моноширинными тегами. Пустой массив – блок не показывается. */
  stack: string[];
  /** Путь от папки public/, например "/team/valentin.jpg". null – плейсхолдер с инициалами. */
  photo: string | null;
  photoAlt: string;
};

export type PriceCard = {
  label: string;
  amount: string;
  text: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    siteName: string;
    /** Адрес сайта с https://. Пока это плейсхолдер, og:url не выставляется. */
    siteUrl: string;
    locale: string;
    /** Картинка для соцсетей 1200×630 из public/, например "/og.png". null – без картинки. */
    ogImage: string | null;
  };
  brand: {
    initials: string;
    /** Текст рядом с квадратом-логотипом в шапке. null — только квадрат с инициалами. */
    name: string | null;
  };
  ui: {
    skipToContent: string;
    navLabel: string;
    /** Подпись логотипа для скринридеров, когда brand.name = null. */
    homeLabel: string;
  };
  header: {
    nav: LinkItem[];
    cta: LinkItem;
  };
  hero: {
    id: string;
    /** Моноширинная надпись над заголовком. null — без надписи. */
    eyebrow: string | null;
    title: string;
    subtitle: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    report: {
      fileName: string;
      passedLabel: string;
      progressLabel: string;
      statusPassed: string;
      statusPending: string;
      steps: ReportStep[];
    };
  };
  audience: {
    id: string;
    title: string;
    items: { icon: AudienceIcon; title: string; text: string }[];
  };
  process: {
    id: string;
    title: string;
    lead: string;
    steps: { title: string; text: string; badge: string | null }[];
  };
  pricing: {
    id: string;
    title: string;
    lead: string;
    postpayment: PriceCard;
  };
  team: {
    id: string;
    title: string;
    members: TeamMember[];
  };
  referral: {
    id: string;
    title: string;
    text: string;
    cta: LinkItem;
  };
  faq: {
    id: string;
    title: string;
    lead: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    id: string;
    title: string;
    text: string;
    button: LinkItem;
    handle: string;
  };
  footer: {
    /** Текст после «© год» слева. null — только «© год». */
    owner: string | null;
    /** Текст справа: ФИО, реквизиты или статус самозанятого. */
    legal: string;
  };
};

export const content: SiteContent = {
  meta: {
    title: "Менторство в QA и AQA – Валентин Волков",
    description:
      "Доведём до оффера в QA и автоматизации тестирования: личный план, ревью кода и мок-собеседования. Основная оплата – после оффера.",
    siteName: "Волков · менторство",
    siteUrl: "[https://ваш-домен.ru]",
    locale: "ru_RU",
    ogImage: null,
  },

  brand: {
    initials: "ВВ",
    name: null,
  },

  ui: {
    skipToContent: "Перейти к содержанию",
    navLabel: "Навигация по странице",
    homeLabel: "В начало страницы",
  },

  header: {
    nav: [
      { label: "Как проходит", href: "#process" },
      { label: "Оплата", href: "#pricing" },
      { label: "Команда", href: "#team" },
      { label: "Вопросы", href: "#faq" },
    ],
    cta: { label: "Записаться", href: "#cta" },
  },

  hero: {
    id: "top",
    eyebrow: null,
    title: "Доведём до оффера в QA и AQA",
    subtitle:
      "Составим личный план, будем ревьюить твой код и проводить мок-собеседования, пока не получишь оффер. Основная оплата – только после оффера.",
    primaryCta: { label: "Записаться на бесплатный созвон", href: "#cta" },
    secondaryCta: { label: "Как это работает", href: "#process" },
    report: {
      fileName: "path_to_offer.spec",
      passedLabel: "passed",
      progressLabel: "Пройдено шагов на пути к офферу",
      statusPassed: "пройдено",
      statusPending: "впереди",
      steps: [
        { label: "Диагностика уровня", passed: true },
        { label: "Личный план", passed: true },
        { label: "Практика и ревью кода", passed: true },
        { label: "Мок-собеседования", passed: true },
        { label: "Резюме и отклики", passed: true },
        { label: "Оффер – следующий шаг твой", passed: false },
      ],
    },
  },

  audience: {
    id: "audience",
    title: "Кому подойдёт",
    items: [
      {
        icon: "compass",
        title: "С нуля в IT",
        text: "Хочешь войти в IT через тестирование, но не понимаешь, с чего начать и что учить. Соберём базу и понятный маршрут до первой работы.",
      },
      {
        icon: "code",
        title: "Manual → AQA",
        text: "Уже работаешь в ручном тестировании и хочешь в автоматизацию. Выберем язык и стек, соберём проект, который не стыдно показать на собеседовании.",
      },
      {
        icon: "trending-up",
        title: "Хочешь грейд выше",
        text: "Целишься в бигтех или на следующий грейд. Закроем пробелы, подтянем архитектуру тестов и подготовим к сильным собеседованиям.",
      },
    ],
  },

  process: {
    id: "process",
    title: "Как проходит менторство",
    lead: "Шесть шагов от первого созвона до оффера. План подстраиваем под твой уровень и цель.",
    steps: [
      {
        title: "Диагностика",
        text: "Созваниваемся, разбираем твой опыт, цель и сроки. Понимаем, с какой точки стартуем.",
        badge: "Бесплатно",
      },
      {
        title: "Личный план",
        text: "Составляем план под тебя: что учить, в каком порядке и какой проект собрать для портфолио.",
        badge: null,
      },
      {
        title: "Практика и ревью",
        text: "Решаешь задачи и пишешь код, а мы ревьюим его – как в рабочей команде.",
        badge: null,
      },
      {
        title: "Мок-собеседования",
        text: "Проводим тренировочные собеседования: теория, live-coding и разбор ошибок после каждого.",
        badge: null,
      },
      {
        title: "Резюме и отклики",
        text: "Переписываем резюме под вакансии, которые тебе интересны, и выстраиваем стратегию откликов.",
        badge: null,
      },
      {
        title: "Оффер",
        text: "Получаешь оффер – и только после этого вносишь основную оплату.",
        badge: null,
      },
    ],
  },

  pricing: {
    id: "pricing",
    title: "Платишь, когда есть результат",
    lead: "Основная оплата – после оффера. Нам так же важно, чтобы ты дошёл до результата, как и тебе.",
    postpayment: {
      label: "Постоплата",
      amount: "[УСЛОВИЯ]",
      text: "Платишь, только когда получишь оффер. [Подробности: процент или сумма, сроки оплаты]",
    },
  },

  team: {
    id: "team",
    title: "Кто с тобой работает",
    members: [
      {
        name: "Валентин Волков",
        role: "AQA Engineer",
        description:
          "За 7 месяцев вырос от стажёра до ведущего инженера по автоматизации, поэтому знаю, где застреваешь на первых этапах. Проведу тебе бесплатный созвон-знакомство.",
        stack: [],
        photo: "/team/valentin.jpg",
        photoAlt: "Валентин Волков, AQA Engineer",
      },
      {
        name: "Александр",
        role: "QA Lead",
        description:
          "Опыт в тестировании более 8 лет. Вырос от ручного тестировщика до автоматизатора.",
        stack: [],
        photo: "/team/qa-lead.jpg",
        photoAlt: "Александр, QA Lead",
      },
    ],
  },

  referral: {
    id: "referral",
    title: "Приведи друга – получи 10%",
    text: "Порекомендуй менторство другу и получи 10% от постоплаты.",
    cta: { label: "Узнать условия", href: "#cta" },
  },

  faq: {
    id: "faq",
    title: "Частые вопросы",
    lead: "Не нашёл ответа – спроси на бесплатном созвоне.",
    items: [
      {
        question: "Что будет, если я не получу оффер?",
        answer:
          "Платишь только после оффера: нет оффера – нет оплаты.",
      },
      {
        question: "Сколько времени нужно уделять в неделю?",
        answer:
          "Рассчитывай на [ЧАСЫ] часов в неделю. Чем стабильнее занимаешься, тем быстрее дойдёшь до собеседований – темп обсудим на диагностике.",
      },
      {
        question: "Обучаете работать с ИИ?",
        answer: "Да, обучаем.",
      },
    ],
  },

  cta: {
    id: "cta",
    title: "Начнём с бесплатного созвона",
    text: "Расскажи, где ты сейчас и куда хочешь прийти. Разберём твой уровень и предложим план – это ни к чему не обязывает.",
    button: { label: "Написать в Telegram", href: "https://t.me/SadLiter" },
    handle: "@SadLiter",
  },

  footer: {
    owner: null,
    legal: "Волков Валентин Александрович",
  },
};
