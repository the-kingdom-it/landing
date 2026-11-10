/* Свой мультяшный жук: глянцевые надкрылья, глазки, усики, шесть лапок (смотрит вверх). */

/** Общий градиент панциря — один на страницу. */
export function BugDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="bug-shell" cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#4a505c" />
          <stop offset="0.45" stopColor="#1b1d23" />
          <stop offset="1" stopColor="#07080a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function BugSprite() {
  return (
    <svg viewBox="0 0 40 44" width="100%" height="100%" className="bug-sprite" aria-hidden="true" focusable="false">
      <ellipse className="bug-shadow" cx="22.5" cy="27.5" rx="11" ry="14" />
      <g className="bug-legs" stroke="#0d0e12" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M13 18 6 13" />
        <path d="M27 26h8" />
        <path d="M13 33 6 39" />
      </g>
      <g className="bug-legs bug-legs--b" stroke="#0d0e12" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M27 18 34 13" />
        <path d="M13 26H5" />
        <path d="M27 33 34 39" />
      </g>
      <g stroke="#0d0e12" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M18 7Q15.5 2.5 12 1.5" />
        <path d="M22 7Q24.5 2.5 28 1.5" />
      </g>
      <circle cx="20" cy="10" r="5" fill="#15171c" />
      <ellipse cx="16.4" cy="26" rx="6.6" ry="12" fill="url(#bug-shell)" stroke="rgba(255,236,200,0.35)" strokeWidth="0.8" />
      <ellipse cx="23.6" cy="26" rx="6.6" ry="12" fill="url(#bug-shell)" stroke="rgba(255,236,200,0.35)" strokeWidth="0.8" />
      <ellipse cx="14.4" cy="21" rx="1.5" ry="4.6" fill="#fff" opacity="0.35" />
      <ellipse cx="21.8" cy="21" rx="1.5" ry="4.6" fill="#fff" opacity="0.28" />
      <circle cx="17.7" cy="8.6" r="2.1" fill="#fff" />
      <circle cx="22.3" cy="8.6" r="2.1" fill="#fff" />
      <circle cx="17.9" cy="8" r="0.95" fill="#000" />
      <circle cx="22.1" cy="8" r="0.95" fill="#000" />
    </svg>
  );
}
