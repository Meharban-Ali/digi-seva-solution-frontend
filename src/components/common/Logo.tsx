interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <linearGradient id="logoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="40%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="logoDocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>

        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="logoEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Outer Shield Base Contour */}
      <path d="M50 6 C74 6 88 15 88 40 C88 65 69 85 50 94 C31 85 12 65 12 40 C12 15 26 6 50 6 Z" fill="url(#logoShieldGrad)" />

      {/* Shield Inner Border Highlight */}
      <path d="M50 11 C71 11 83 19 83 41 C83 62 66 80 50 87 C34 80 17 62 17 41 C17 19 29 11 50 11 Z" fill="none" stroke="#60A5FA" strokeWidth="2" strokeOpacity="0.4" />

      {/* Government & Digital Service Document Card */}
      <rect x="31" y="25" width="38" height="48" rx="6" fill="url(#logoDocGrad)" />

      {/* Folded Corner Detail */}
      <path d="M57 25 L69 37 L57 37 Z" fill="#CBD5E1" />

      {/* Document Structure Lines */}
      <rect x="37" y="34" width="16" height="3.5" rx="1.75" fill="#2563EB" />
      <rect x="37" y="42" width="26" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="37" y="48" width="22" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="37" y="54" width="16" height="3" rx="1.5" fill="#94A3B8" />

      {/* Official Jan Seva Gold Accreditation Star Badge */}
      <circle cx="34" cy="27" r="7.5" fill="url(#logoGoldGrad)" />
      <path d="M34 23.2 L35.2 26 L38.2 26.2 L36 28.1 L36.7 31 L34 29.4 L31.3 31 L32 28.1 L29.8 26.2 L32.8 26 Z" fill="#FFFFFF" />

      {/* Verified Checkmark Seal Badge */}
      <circle cx="65" cy="65" r="11" fill="url(#logoEmeraldGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M60 65 L63.5 68.5 L70 61.5" fill="none" stroke="#FFFFFF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ iconOnly = false, size = "md", variant = "dark", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: { icon: "h-7 w-7", textTitle: "text-base", textSub: "text-[10px]" },
    md: { icon: "h-9 w-9", textTitle: "text-lg", textSub: "text-xs" },
    lg: { icon: "h-11 w-11", textTitle: "text-xl", textSub: "text-sm" },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <LogoIcon className={`${currentSize.icon} shrink-0`} />
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${variant === "light" ? "text-white" : "text-slate-900"} ${currentSize.textTitle}`}>
            Digi Seva
          </span>
          <span className={`font-bold tracking-widest uppercase leading-tight text-primary ${currentSize.textSub}`}>
            Solution
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
