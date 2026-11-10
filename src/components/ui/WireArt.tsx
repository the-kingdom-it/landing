import type { ReactNode } from "react";
import type { ArtName } from "@/lib/art";

/*
 * Каркасные картинки «сеткой» для карточек роадмапа. Свои рисунки: объёмы с меридианами и параллелями.
 * .wa-out — контур, .wa-mesh — сетка (в стиле "outline" скрыта), .wa-fill — заливка (глаза, огоньки).
 */

const r = (n: number) => Math.round(n * 10) / 10;

/** Сетка на эллипсоиде: вертикальные «меридианы» и передние дуги «параллелей». */
function ellipsoidMesh(cx: number, cy: number, a: number, b: number, meridians = 3, parallels = 5, tilt = 0.28): ReactNode {
  const lines: ReactNode[] = [];
  for (let i = 1; i <= meridians; i++) {
    const rx = a * Math.sin((i / (meridians + 1)) * (Math.PI / 2));
    lines.push(<ellipse key={`m${i}`} cx={cx} cy={cy} rx={r(rx)} ry={b} />);
  }
  lines.push(<line key="m0" x1={cx} y1={cy - b} x2={cx} y2={cy + b} />);
  for (let j = 1; j <= parallels; j++) {
    const phi = -Math.PI / 2 + (j / (parallels + 1)) * Math.PI;
    const y = cy + b * Math.sin(phi);
    const rx = a * Math.cos(phi);
    lines.push(<path key={`p${j}`} d={`M${r(cx - rx)} ${r(y)} A${r(rx)} ${r(rx * tilt)} 0 0 0 ${r(cx + rx)} ${r(y)}`} />);
  }
  return lines;
}

/** Сетка на плоской грани-параллелограмме: o — угол, u и v — стороны. */
function faceGrid(o: [number, number], u: [number, number], v: [number, number], n = 3): ReactNode {
  const lines: ReactNode[] = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push(<line key={`u${i}`} x1={r(o[0] + u[0] * t)} y1={r(o[1] + u[1] * t)} x2={r(o[0] + u[0] * t + v[0])} y2={r(o[1] + u[1] * t + v[1])} />);
    lines.push(<line key={`v${i}`} x1={r(o[0] + v[0] * t)} y1={r(o[1] + v[1] * t)} x2={r(o[0] + v[0] * t + u[0])} y2={r(o[1] + v[1] * t + u[1])} />);
  }
  return lines;
}

const face = (o: [number, number], u: [number, number], v: [number, number]) =>
  `M${o[0]} ${o[1]} l${u[0]} ${u[1]} l${v[0]} ${v[1]} l${-u[0]} ${-u[1]}Z`;

function Magnifier() {
  const spokes = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    return <line key={i} x1={r(66 + 30 * Math.cos(a))} y1={r(64 + 30 * Math.sin(a))} x2={r(66 + 38 * Math.cos(a))} y2={r(64 + 38 * Math.sin(a))} />;
  });
  return (
    <>
      <g className="wa-mesh">
        {spokes}
        <circle cx="66" cy="64" r="34" />
        <path d="M48 50 A22 22 0 0 1 62 42" />
        <path d="M46 60 A24 24 0 0 1 48 54" />
        <g transform="rotate(-45 112 112)">
          <line x1="104" y1="96" x2="120" y2="96" />
          <line x1="104" y1="106" x2="120" y2="106" />
          <line x1="104" y1="116" x2="120" y2="116" />
          <line x1="104" y1="126" x2="120" y2="126" />
          <line x1="112" y1="88" x2="112" y2="134" />
        </g>
      </g>
      <g className="wa-out">
        <circle cx="66" cy="64" r="38" />
        <circle cx="66" cy="64" r="30" />
        <rect x="104" y="86" width="16" height="50" rx="8" transform="rotate(-45 112 112)" />
      </g>
    </>
  );
}

function Bug() {
  return (
    <>
      <g className="wa-mesh">
        {ellipsoidMesh(80, 94, 32, 42, 3, 6)}
        {ellipsoidMesh(80, 42, 17, 15, 2, 3)}
      </g>
      <g className="wa-out">
        <ellipse cx="80" cy="94" rx="32" ry="42" />
        <ellipse cx="80" cy="42" rx="17" ry="15" />
        <path d="M49 74 L30 64 L22 70 M48 94 L26 94 L18 102 M50 114 L32 126 L28 136" />
        <path d="M111 74 L130 64 L138 70 M112 94 L134 94 L142 102 M110 114 L128 126 L132 136" />
        <path d="M72 29 Q64 14 54 12 M88 29 Q96 14 106 12" />
      </g>
      <circle className="wa-fill" cx="73" cy="42" r="3.6" />
      <circle className="wa-fill" cx="87" cy="42" r="3.6" />
    </>
  );
}

function Globe() {
  return (
    <>
      <g className="wa-mesh">{ellipsoidMesh(80, 80, 46, 46, 3, 5, 0.3)}</g>
      <g className="wa-out">
        <circle cx="80" cy="80" r="46" />
        <ellipse cx="80" cy="80" rx="70" ry="20" transform="rotate(-18 80 80)" />
      </g>
      <circle className="wa-fill" cx="140" cy="62" r="4.5" />
    </>
  );
}

function Cube() {
  const top: [[number, number], [number, number], [number, number]] = [[80, 30], [42, 22], [-42, 22]];
  return (
    <>
      <g className="wa-mesh">
        {faceGrid([80, 30], [42, 22], [-42, 22])}
        {faceGrid([38, 52], [42, 22], [0, 48])}
        {faceGrid([80, 74], [42, -22], [0, 48])}
      </g>
      <g className="wa-out">
        <path d={face(...top)} />
        <path d={face([38, 52], [42, 22], [0, 48])} />
        <path d={face([80, 74], [42, -22], [0, 48])} />
      </g>
    </>
  );
}

function Robot() {
  const grid: ReactNode[] = [];
  for (const x of [56, 72, 88, 104]) grid.push(<line key={`x${x}`} x1={x} y1={52} x2={x} y2={110} />);
  for (const y of [64, 78, 92, 104]) grid.push(<line key={`y${y}`} x1={44} y1={y} x2={116} y2={y} />);
  return (
    <>
      <g className="wa-mesh">
        {grid}
        <line x1="62" y1="124" x2="62" y2="140" />
        <line x1="80" y1="124" x2="80" y2="140" />
        <line x1="98" y1="124" x2="98" y2="140" />
      </g>
      <g className="wa-out">
        <rect x="40" y="48" width="80" height="66" rx="18" />
        <path d="M80 48 V30" />
        <circle cx="80" cy="25" r="5" />
        <rect x="28" y="70" width="12" height="22" rx="5" />
        <rect x="120" y="70" width="12" height="22" rx="5" />
        <path d="M66 100 H94" />
        <path d="M50 124 Q50 116 58 116 H102 Q110 116 110 124 V140 H50Z" />
      </g>
      <circle className="wa-fill" cx="64" cy="80" r="6" />
      <circle className="wa-fill" cx="96" cy="80" r="6" />
    </>
  );
}

function Chip() {
  const pins: ReactNode[] = [];
  for (const p of [62, 74, 86, 98]) {
    pins.push(<path key={`t${p}`} d={`M${p} 46 V32`} />, <path key={`b${p}`} d={`M${p} 114 V128`} />);
    pins.push(<path key={`l${p}`} d={`M46 ${p} H32`} />, <path key={`r${p}`} d={`M114 ${p} H128`} />);
  }
  const grid: ReactNode[] = [];
  for (const g of [58, 69, 80, 91, 102]) grid.push(<line key={`x${g}`} x1={g} y1={50} x2={g} y2={110} />, <line key={`y${g}`} x1={50} y1={g} x2={110} y2={g} />);
  return (
    <>
      <g className="wa-mesh">{grid}</g>
      <g className="wa-out">
        {pins}
        <rect x="46" y="46" width="68" height="68" rx="10" />
        <rect x="66" y="66" width="28" height="28" rx="4" />
      </g>
      <circle className="wa-fill" cx="32" cy="32" r="3" />
      <circle className="wa-fill" cx="128" cy="128" r="3" />
    </>
  );
}

function Gear() {
  const teeth = 10;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const outer = i % 2 === 0;
    const a0 = ((i - 0.32) / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 0.32) / (teeth * 2)) * Math.PI * 2;
    const rad = outer ? 54 : 44;
    pts.push(`${r(80 + rad * Math.cos(a0))} ${r(80 + rad * Math.sin(a0))}`, `${r(80 + rad * Math.cos(a1))} ${r(80 + rad * Math.sin(a1))}`);
  }
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return <line key={i} x1={r(80 + 16 * Math.cos(a))} y1={r(80 + 16 * Math.sin(a))} x2={r(80 + 42 * Math.cos(a))} y2={r(80 + 42 * Math.sin(a))} />;
  });
  return (
    <>
      <g className="wa-mesh">
        {spokes}
        <circle cx="80" cy="80" r="26" />
        <circle cx="80" cy="80" r="35" />
      </g>
      <g className="wa-out">
        <path d={`M${pts.join(" L")}Z`} />
        <circle cx="80" cy="80" r="16" />
      </g>
    </>
  );
}

function Rocket() {
  return (
    <>
      <g className="wa-mesh">
        {ellipsoidMesh(80, 76, 22, 50, 2, 7, 0.32)}
        <circle cx="80" cy="64" r="6" />
      </g>
      <g className="wa-out">
        <ellipse cx="80" cy="76" rx="22" ry="50" />
        <circle cx="80" cy="64" r="11" />
        <path d="M60 98 L42 120 L44 128 L62 116" />
        <path d="M100 98 L118 120 L116 128 L98 116" />
        <path d="M72 128 Q74 140 80 150 Q86 140 88 128" />
      </g>
      <circle className="wa-fill" cx="80" cy="136" r="3.5" />
    </>
  );
}

const ART: Record<ArtName, () => ReactNode> = {
  magnifier: Magnifier,
  bug: Bug,
  globe: Globe,
  cube: Cube,
  robot: Robot,
  chip: Chip,
  gear: Gear,
  rocket: Rocket,
};

export function WireArt({ name, className = "" }: { name: ArtName; className?: string }) {
  const Art = ART[name];
  return (
    <svg viewBox="0 0 160 160" className={`wire-art ${className}`} data-art={name} aria-hidden="true" focusable="false">
      <Art />
    </svg>
  );
}
