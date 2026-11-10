/* «Физика» жуков: где появляются, как ползают и убегают от лупы. Чистые функции — их проверяют тесты. */

export type Point = { x: number; y: number };
export type View = { width: number; height: number };
/** Прямоугольник блока интерфейса в координатах экрана — жуки его обходят. */
export type Rect = { left: number; top: number; right: number; bottom: number };
export type Bug = {
  id: number;
  x: number;
  y: number;
  /** Направление движения в радианах: 0 — вправо, π/2 — вниз. */
  angle: number;
  /** Текущая скорость поворота (рад/с) — даёт петляющую траекторию. */
  turn: number;
  /** Текущая скорость (px/с) и обычная скорость этого жука. */
  speed: number;
  baseSpeed: number;
  /** Сколько миллисекунд жук уже под лупой. */
  dwell: number;
};

export const BUG = {
  size: 34,
  /** Насколько за краем экрана жук появляется и считается ушедшим. */
  margin: 48,
  minSpeed: 45,
  maxSpeed: 80,
  /** Плавность петляния. */
  wanderAccel: 3,
  maxTurn: 1.4,
  /** Радиус, с которого жук замечает лупу, и во сколько раз ускоряется вплотную. */
  fleeRadius: 110,
  fleeBoost: 1.7,
  fleeTurnRate: 9,
  /** Радиус кольца лупы и сколько держать жука под ним, чтобы поймать. */
  lensRadius: 20,
  dwellMs: 220,
  /** Самый длинный учитываемый кадр — чтобы жук не «телепортировался» после фоновой вкладки. */
  maxFrameMs: 50,
  /** Насколько далеко вперёд жук «смотрит», чтобы обойти блок, и как резко поворачивает. */
  avoidLook: 44,
  avoidPad: 6,
  avoidTurnRate: 7,
  /** Скорость, с которой жуки разбегаются после награды. */
  scatterSpeed: 420,
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const between = (rand: () => number, min: number, max: number) => min + rand() * (max - min);

/** Новый жук за случайным краем экрана, ползёт к случайной точке в центральной части. */
export function spawnBug(id: number, view: View, rand: () => number = Math.random): Bug {
  const edge = Math.min(3, Math.floor(rand() * 4));
  const along = between(rand, 0.1, 0.9);
  const half = BUG.margin / 2;
  const start: Point =
    edge === 0
      ? { x: along * view.width, y: -half }
      : edge === 1
        ? { x: view.width + half, y: along * view.height }
        : edge === 2
          ? { x: along * view.width, y: view.height + half }
          : { x: -half, y: along * view.height };
  const target: Point = {
    x: between(rand, 0.2, 0.8) * view.width,
    y: between(rand, 0.2, 0.8) * view.height,
  };
  const baseSpeed = between(rand, BUG.minSpeed, BUG.maxSpeed);
  return {
    id,
    ...start,
    angle: Math.atan2(target.y - start.y, target.x - start.x),
    turn: 0,
    speed: baseSpeed,
    baseSpeed,
    dwell: 0,
  };
}

function inRect(x: number, y: number, rect: Rect, pad = 0): boolean {
  return x > rect.left - pad && x < rect.right + pad && y > rect.top - pad && y < rect.bottom + pad;
}

/**
 * Один кадр: жук петляет, рядом с курсором ускоряется и разворачивается от него,
 * а перед блоками интерфейса (obstacles) сворачивает в сторону, где свободно.
 */
export function stepBug(
  bug: Bug,
  dtMs: number,
  _view: View,
  cursor: Point | null,
  rand: () => number = Math.random,
  obstacles: Rect[] = [],
): Bug {
  const dt = Math.min(dtMs, BUG.maxFrameMs) / 1000;
  let turn = clamp(bug.turn + (rand() - 0.5) * 2 * BUG.wanderAccel * dt, -BUG.maxTurn, BUG.maxTurn);
  let angle = bug.angle + turn * dt;

  // уже под блоком — просто выходим из-под него; иначе смотрим вперёд и обходим
  const underPanel = obstacles.some((rect) => inRect(bug.x, bug.y, rect));
  if (obstacles.length > 0 && !underPanel) {
    const blocked = (a: number) => {
      const px = bug.x + Math.cos(a) * BUG.avoidLook;
      const py = bug.y + Math.sin(a) * BUG.avoidLook;
      return obstacles.some((rect) => inRect(px, py, rect, BUG.avoidPad));
    };
    if (blocked(angle)) {
      const leftFree = !blocked(angle - 0.9);
      const rightFree = !blocked(angle + 0.9);
      const side = leftFree && !rightFree ? -1 : rightFree && !leftFree ? 1 : bug.turn >= 0 ? 1 : -1;
      angle += side * BUG.avoidTurnRate * dt;
      turn = side * BUG.maxTurn;
    }
  }
  let speed = bug.baseSpeed;

  if (cursor) {
    const distance = Math.hypot(bug.x - cursor.x, bug.y - cursor.y);
    if (distance < BUG.fleeRadius) {
      const away = Math.atan2(bug.y - cursor.y, bug.x - cursor.x);
      const diff = Math.atan2(Math.sin(away - angle), Math.cos(away - angle));
      const maxStep = BUG.fleeTurnRate * dt;
      angle += clamp(diff, -maxStep, maxStep);
      speed = bug.baseSpeed * (1 + (BUG.fleeBoost - 1) * (1 - distance / BUG.fleeRadius));
    }
  }

  const next = { ...bug, angle, turn, speed, x: bug.x + Math.cos(angle) * speed * dt, y: bug.y + Math.sin(angle) * speed * dt };
  // не заходим под блок, даже если поворот не успел: стоим на месте и продолжаем поворачивать
  if (!underPanel && obstacles.some((rect) => inRect(next.x, next.y, rect))) return { ...next, x: bug.x, y: bug.y };
  return next;
}

export function isOffscreen(bug: Bug, view: View): boolean {
  return bug.x < -BUG.margin || bug.y < -BUG.margin || bug.x > view.width + BUG.margin || bug.y > view.height + BUG.margin;
}

export function isInLens(bug: Bug, cursor: Point | null, radius: number = BUG.lensRadius): boolean {
  return cursor !== null && Math.hypot(bug.x - cursor.x, bug.y - cursor.y) <= radius;
}

/** Промокод за пойманных жуков: шесть случайных цифр (владелец их не проверяет). */
export function makePromoCode(rand: () => number = Math.random): string {
  return String(100000 + Math.floor(rand() * 900000));
}

/** Жук разбегается: быстро и без петляний к ближайшему краю экрана. */
export function scatterBug(bug: Bug, view: View): Bug {
  const exits: [number, number][] = [
    [bug.x, Math.PI],
    [view.width - bug.x, 0],
    [bug.y, -Math.PI / 2],
    [view.height - bug.y, Math.PI / 2],
  ];
  const [, angle] = exits.reduce((best, exit) => (exit[0] < best[0] ? exit : best));
  return { ...bug, angle, turn: 0, speed: BUG.scatterSpeed, baseSpeed: BUG.scatterSpeed, dwell: 0 };
}
