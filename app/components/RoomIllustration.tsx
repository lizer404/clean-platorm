export default function RoomIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="floor" x1="40" y1="300" x2="440" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8F4FF" />
          <stop offset="1" stopColor="#DFF7F2" />
        </linearGradient>
        <linearGradient id="wall" x1="60" y1="40" x2="420" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7FBFF" />
          <stop offset="1" stopColor="#E4F2FF" />
        </linearGradient>
        <linearGradient id="window" x1="280" y1="70" x2="400" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9BD4FF" />
          <stop offset="1" stopColor="#B8F0E6" />
        </linearGradient>
      </defs>

      <rect x="28" y="36" width="424" height="288" rx="28" fill="url(#wall)" />
      <path d="M28 250H452V324C452 339.464 439.464 352 424 352H56C40.536 352 28 339.464 28 324V250Z" fill="url(#floor)" />
      <path d="M28 250H452" stroke="#C5DBEF" strokeWidth="2" />

      {/* Window */}
      <rect x="286" y="72" width="120" height="96" rx="14" fill="url(#window)" stroke="#7EB8E8" strokeWidth="3" />
      <path d="M346 72V168M286 120H406" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
      <path d="M300 88C318 102 334 102 352 88" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.55" />

      {/* Curtain */}
      <path d="M274 68C274 68 268 110 274 148C280 110 274 68 274 68Z" fill="#1A8CFF" opacity="0.18" />
      <path d="M418 68C418 68 424 110 418 148C412 110 418 68 418 68Z" fill="#1A8CFF" opacity="0.18" />

      {/* Sofa */}
      <rect x="58" y="188" width="170" height="62" rx="18" fill="#1A8CFF" opacity="0.16" />
      <rect x="70" y="176" width="66" height="36" rx="12" fill="#0B6FD9" opacity="0.22" />
      <rect x="150" y="176" width="66" height="36" rx="12" fill="#0B6FD9" opacity="0.22" />
      <rect x="52" y="236" width="24" height="18" rx="6" fill="#0B6FD9" opacity="0.28" />
      <rect x="210" y="236" width="24" height="18" rx="6" fill="#0B6FD9" opacity="0.28" />

      {/* Plant */}
      <rect x="248" y="220" width="18" height="28" rx="6" fill="#12A38A" opacity="0.35" />
      <path d="M257 220C246 196 232 198 236 182C252 190 258 200 257 220Z" fill="#12A38A" opacity="0.55" />
      <path d="M257 220C268 198 282 200 278 182C262 190 258 204 257 220Z" fill="#12A38A" opacity="0.45" />

      {/* Sparkles */}
      <path d="M120 96L124 108L136 112L124 116L120 128L116 116L104 112L116 108L120 96Z" fill="#1A8CFF" opacity="0.45" />
      <path d="M210 78L212 86L220 88L212 90L210 98L208 90L200 88L208 86L210 78Z" fill="#12A38A" opacity="0.5" />
      <circle cx="392" cy="210" r="5" fill="#1A8CFF" opacity="0.35" />
      <circle cx="410" cy="228" r="3" fill="#12A38A" opacity="0.45" />

      {/* Cleaning bottle */}
      <rect x="360" y="248" width="28" height="42" rx="8" fill="#1A8CFF" opacity="0.7" />
      <rect x="368" y="238" width="12" height="14" rx="4" fill="#0B6FD9" />
      <path d="M366 262H382" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
