import { useState, useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";

export type MetricAccent =
  | "navy"
  | "orange"
  | "navy-slate"
  | "navy-indigo"
  | "slate-dark"
  | "amber"
  | "warm-slate"
  // Legacy alias fallbacks mapping to brand palette
  | "rose"
  | "emerald"
  | "indigo"
  | "purple"
  | "gold"
  | "slate";

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  icon: LucideIcon;
  isLoading?: boolean;
  isError?: boolean;
  accentColor?: MetricAccent;
  subtitle?: string;
  isPrimary?: boolean;
  animationDelay?: number;
}

// Brand Token Derived Gradient System (Navy & Orange Tonal Variations)
const gradientMap: Record<MetricAccent, string> = {
  // 1. Primary Deep Navy (#0B2046 / #0E3676)
  navy: "bg-gradient-to-br from-[#0B2046] via-[#143269] to-slate-900 text-white border border-[#1A4280]/40 shadow-md",
  
  // 2. Actionable Brand Orange (#EA580C / #F95700) - For stats needing attention like New Enquiries
  orange: "bg-gradient-to-br from-[#EA580C] via-[#F95700] to-[#C2410C] text-white border border-orange-400/40 shadow-md shadow-orange-500/10",
  rose: "bg-gradient-to-br from-[#EA580C] via-[#F95700] to-[#C2410C] text-white border border-orange-400/40 shadow-md shadow-orange-500/10", // Mapped to brand orange
  
  // 3. Slate Navy (#0E3676 / Slate)
  "navy-slate": "bg-gradient-to-br from-[#0E3676] via-[#1E4B94] to-[#0B2046] text-white border border-blue-400/30 shadow-md",
  emerald: "bg-gradient-to-br from-[#0E3676] via-[#1E4B94] to-[#0B2046] text-white border border-blue-400/30 shadow-md", // Mapped to slate navy
  
  // 4. Midnight Navy (#1E293B / #0B2046)
  "navy-indigo": "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B2046] text-white border border-slate-700/60 shadow-md",
  indigo: "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B2046] text-white border border-slate-700/60 shadow-md", // Mapped to midnight navy
  
  // 5. Deep Slate (Slate-800 / Slate-950)
  "slate-dark": "bg-gradient-to-br from-[#1E293B] via-[#334155] to-slate-900 text-white border border-slate-700/60 shadow-md",
  purple: "bg-gradient-to-br from-[#1E293B] via-[#334155] to-slate-900 text-white border border-slate-700/60 shadow-md", // Mapped to deep slate
  
  // 6. Warm Amber-Orange
  amber: "bg-gradient-to-br from-[#D97706] via-[#EA580C] to-[#92400E] text-white border border-amber-500/40 shadow-md",
  gold: "bg-gradient-to-br from-[#D97706] via-[#EA580C] to-[#92400E] text-white border border-amber-500/40 shadow-md", // Mapped to warm amber
  
  // 7. Warm Slate-Amber
  "warm-slate": "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#451A03] text-white border border-amber-900/40 shadow-md",
  slate: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white border border-slate-700/60 shadow-md",
};

/**
 * AnimatedNumber: Smooth requestAnimationFrame count-up from 0 (or previous value) to target value
 */
function AnimatedNumber({ value }: { value: number | string | undefined }) {
  const targetNum = typeof value === "number" ? value : parseInt(String(value || "0"), 10) || 0;
  const [displayVal, setDisplayVal] = useState(0);
  const prevValRef = useRef(0);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isNaN(targetNum)) {
      setDisplayVal(targetNum);
      prevValRef.current = targetNum;
      return;
    }

    const startVal = prevValRef.current;
    let startTimestamp: number | null = null;
    const duration = 850;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth cubic ease-out curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + easedProgress * (targetNum - startVal));
      setDisplayVal(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayVal(targetNum);
        prevValRef.current = targetNum;
      }
    };

    window.requestAnimationFrame(step);
  }, [targetNum]);

  if (typeof value === "string" && isNaN(Number(value))) {
    return <span>{value}</span>;
  }

  return <span>{displayVal}</span>;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  isLoading,
  isError,
  accentColor = "navy",
  subtitle,
  isPrimary = false,
  animationDelay = 0,
}: MetricCardProps) {
  const gradientClass = gradientMap[accentColor] || gradientMap.navy;

  return (
    <div
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
      className={`group rounded-2xl p-5 ${gradientClass} transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl relative overflow-hidden animate-dash-card-entrance`}
    >
      {/* Soft Inner Glow Ray */}
      <div 
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" 
        aria-hidden="true"
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2 min-w-0 flex-1 pr-3">
          <p className="font-extrabold uppercase tracking-wider text-xs text-white/90 leading-snug break-words">
            {title}
          </p>

          {isLoading ? (
            <div className="h-9 w-24 bg-white/20 animate-pulse rounded-lg mt-1" />
          ) : isError ? (
            <p className="text-xs font-bold text-rose-200 mt-1">Unable to load</p>
          ) : (
            <div className="flex items-baseline space-x-2 pt-0.5">
              <span
                className={`font-mono font-black text-white tracking-tight ${
                  isPrimary ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                }`}
              >
                <AnimatedNumber value={value} />
              </span>
              {subtitle && (
                <span className="text-xs text-white/80 font-semibold font-mono">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Brand-Styled Icon Badge with Pop Animation */}
        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-white shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <Icon className={isPrimary ? "h-6 w-6" : "h-5 w-5"} />
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
