interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  detailed?: boolean;
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string; detailed?: boolean }) {
  return (
    <img
      src="/logo-icon.png"
      alt="Digi Seva Solution Emblem"
      className={`object-contain ${className}`}
    />
  );
}

export function Logo({ iconOnly = false, size = "md", variant = "dark", className = "" }: LogoProps) {
  const heightClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12 sm:h-14",
  };

  const heightClass = heightClasses[size] || "h-10";

  if (iconOnly) {
    return (
      <img
        src="/logo-icon.png"
        alt="Digi Seva Solution Icon"
        className={`${heightClass} w-auto object-contain ${className}`}
      />
    );
  }

  const logoSrc = variant === "light" ? "/logo-lockup-light.png" : "/logo-lockup.png";

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Digi Seva Solution - Digital Services & Solution Partner"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
}

export default Logo;
