interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  detailed?: boolean;
}

export function LogoIcon({ className = "h-8 w-8", detailed = false }: { className?: string; detailed?: boolean }) {
  if (detailed) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" className={className}>
        <defs>
          <linearGradient id="shieldBgGradDetLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="45%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="rimGradDetLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="goldGradDetLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="blueFgGradDetLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="navyBgGradDetLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        <path d="M256 26 C360 26 438 65 438 180 C438 315 352 420 256 478 C160 420 74 315 74 180 C74 65 152 26 256 26 Z" fill="url(#shieldBgGradDetLogo)" />
        <path d="M256 40 C348 40 420 76 420 178 C420 300 342 398 256 452 C170 398 92 300 92 178 C92 76 164 40 256 40 Z" fill="none" stroke="url(#rimGradDetLogo)" strokeWidth="7" strokeLinecap="round" />
        <path d="M256 56 C334 56 398 90 398 176 C398 286 328 376 256 426 C184 376 114 286 114 176 C114 90 178 56 256 56 Z" fill="#0F172A" fillOpacity="0.55" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="2" />

        <path d="M106 312 C 185 390 330 370 425 240 C 355 315 215 332 106 312 Z" fill="url(#goldGradDetLogo)" />

        <path d="M370 265 L395 242 M385 285 L415 270 M360 305 L390 310" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <circle cx="395" cy="242" r="4.5" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="415" cy="270" r="4.5" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="390" cy="310" r="4" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />

        <g transform="translate(6, 6)">
          <path d="M168 142 H255 C310 142 348 178 348 238 C348 298 310 334 255 334 H168 V142 Z M208 178 V298 H250 C284 298 306 276 306 238 C306 200 284 178 250 178 H208 Z" fill="url(#navyBgGradDetLogo)" opacity="0.85" />
          <path d="M336 172 C324 154 300 142 270 142 C228 142 200 166 200 198 C200 248 300 236 300 278 C300 296 282 308 256 308 C226 308 200 290 188 268 L152 288 C172 324 210 346 256 346 C308 346 342 318 342 276 C342 222 242 236 242 196 C242 182 256 174 272 174 C292 174 310 184 320 200 L336 172 Z" fill="url(#navyBgGradDetLogo)" opacity="0.85" />
        </g>

        <g>
          <path d="M168 142 H255 C310 142 348 178 348 238 C348 298 310 334 255 334 H168 V142 Z M208 178 V298 H250 C284 298 306 276 306 238 C306 200 284 178 250 178 H208 Z" fill="url(#blueFgGradDetLogo)" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M336 172 C324 154 300 142 270 142 C228 142 200 166 200 198 C200 248 300 236 300 278 C300 296 282 308 256 308 C226 308 200 290 188 268 L152 288 C172 324 210 346 256 346 C308 346 342 318 342 276 C342 222 242 236 242 196 C242 182 256 174 272 174 C292 174 310 184 320 200 L336 172 Z" fill="url(#goldGradDetLogo)" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />
        </g>

        <path d="M256 55 L264 74 L283 82 L264 90 L256 109 L248 90 L229 82 L248 74 Z" fill="url(#goldGradDetLogo)" />
        <circle cx="256" cy="82" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  // Approved Simplified Version for Navbar & Functional UI
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" className={className}>
      <defs>
        <linearGradient id="shieldBgGradSimLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="45%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="goldGradSimLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="blueFgGradSimLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      <path d="M256 28 C360 28 436 66 436 180 C436 315 350 418 256 476 C162 418 76 315 76 180 C76 66 152 28 256 28 Z" fill="url(#shieldBgGradSimLogo)" />
      <path d="M256 42 C348 42 418 76 418 178 C418 300 340 398 256 450 C172 398 94 300 94 178 C94 76 164 42 256 42 Z" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
      <path d="M110 310 C 185 385 325 365 420 240 C 350 310 215 325 110 310 Z" fill="url(#goldGradSimLogo)" />
      <path d="M168 142 H255 C310 142 348 178 348 238 C348 298 310 334 255 334 H168 V142 Z M210 180 V296 H248 C280 296 304 274 304 238 C304 202 280 180 248 180 H210 Z" fill="url(#blueFgGradSimLogo)" />
      <path d="M336 172 C324 154 300 142 270 142 C228 142 200 166 200 198 C200 248 300 236 300 278 C300 296 282 308 256 308 C226 308 200 290 188 268 L152 288 C172 324 210 346 256 346 C308 346 342 318 342 276 C342 222 242 236 242 196 C242 182 256 174 272 174 C292 174 310 184 320 200 L336 172 Z" fill="url(#goldGradSimLogo)" />
      <path d="M256 60 L263 77 L280 84 L263 91 L256 108 L249 91 L232 84 L249 77 Z" fill="url(#goldGradSimLogo)" />
    </svg>
  );
}

export function Logo({ iconOnly = false, size = "md", variant = "dark", detailed = false, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: { icon: "h-7 w-7", textTitle: "text-base", textSub: "text-[10px]" },
    md: { icon: "h-9 w-9", textTitle: "text-lg", textSub: "text-xs" },
    lg: { icon: "h-11 w-11", textTitle: "text-xl", textSub: "text-sm" },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <LogoIcon className={`${currentSize.icon} shrink-0`} detailed={detailed} />
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${variant === "light" ? "text-white" : "text-slate-900"} ${currentSize.textTitle}`}>
            DIGI SEVA
          </span>
          <span className={`font-extrabold tracking-[0.2em] uppercase leading-tight text-accent-gold-dark ${currentSize.textSub}`}>
            SOLUTION
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
