const NextJsIcon = (
  <svg width="16" height="16" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <mask id="mask_next" stroke="none" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black"/>
    </mask>
    <g mask="url(#mask_next)">
      <circle cx="90" cy="90" r="90" fill="var(--ink)"/>
      <path d="M149.508 157.52L69.142 54H54V126H67.08V69.966L137.95 161.42C142.062 160.33 145.928 159.014 149.508 157.52Z" fill="url(#paint0_next)"/>
      <path d="M115 54H128V126H115V54Z" fill="url(#paint1_next)"/>
    </g>
    <defs>
      <linearGradient id="paint0_next" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_next" x1="121.5" y1="54" x2="121.5" y2="106" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function Footer() {
  return (
    <footer>
      <a href="mailto:ansilmuhammed919@gmail.com" className="footer-cta">
        Say hello →
      </a>
      <div className="footer-next-badge">
        <span>Powered by</span>
        <span className="next-logo-tag">
          {NextJsIcon}
          <strong>Next.js</strong>
        </span>
      </div>
      <p className="footer-copy">© 2026 · Ansil Muhammed N S · ClashLex</p>
    </footer>
  );
}
