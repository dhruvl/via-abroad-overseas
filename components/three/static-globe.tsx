/**
 * Static, non-WebGL globe visual. Used as the Suspense fallback, the
 * reduced-motion substitute, the small-device substitute, and the
 * safety net if the WebGL globe fails to initialize. The page and all
 * CTAs must remain fully usable when this is what renders.
 */
export function StaticGlobe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      role="img"
      aria-label="Illustrated globe representing global study destinations reachable from India"
    >
      <defs>
        <radialGradient id="globe-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#274d84" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0b1f3a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="globe-sphere" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#122a4d" />
          <stop offset="100%" stopColor="#060e1c" />
        </linearGradient>
      </defs>

      <circle cx="240" cy="220" r="210" fill="url(#globe-glow)" />
      <circle cx="240" cy="220" r="150" fill="url(#globe-sphere)" stroke="#d4af37" strokeOpacity="0.35" />

      {/* Latitude / longitude lines */}
      <g stroke="#d4af37" strokeOpacity="0.22" fill="none">
        <ellipse cx="240" cy="220" rx="150" ry="55" />
        <ellipse cx="240" cy="220" rx="150" ry="110" />
        <ellipse cx="240" cy="220" rx="55" ry="150" />
        <ellipse cx="240" cy="220" rx="110" ry="150" />
        <line x1="90" y1="220" x2="390" y2="220" />
        <line x1="240" y1="70" x2="240" y2="370" />
      </g>

      {/* Route arcs from India toward destinations */}
      <g stroke="#e2c569" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M255 235 Q 190 130 130 150" />
        <path d="M255 235 Q 210 110 150 190" />
        <path d="M255 235 Q 300 120 340 150" />
        <path d="M255 235 Q 320 200 360 260" />
        <path d="M255 235 Q 270 150 300 120" />
      </g>

      {/* Destination nodes */}
      <g fill="#d4af37">
        <circle cx="130" cy="150" r="4" />
        <circle cx="150" cy="190" r="4" />
        <circle cx="340" cy="150" r="4" />
        <circle cx="360" cy="260" r="4" />
        <circle cx="300" cy="120" r="4" />
      </g>

      {/* India origin marker */}
      <circle cx="255" cy="235" r="5" fill="#ffffff" />
      <circle cx="255" cy="235" r="9" fill="none" stroke="#ffffff" strokeOpacity="0.5" />
    </svg>
  );
}
