import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export type MetricAccent =
  | "navy"
  | "gold"
  | "emerald"
  | "indigo"
  | "rose"
  | "orange"
  | "purple"
  | "amber"
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
}

const gradientMap: Record<MetricAccent, string> = {
  navy: "bg-gradient-to-br from-[#0B2046] via-[#143269] to-[#0B2046] text-white",
  rose: "bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 text-white",
  emerald: "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white",
  indigo: "bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white",
  purple: "bg-gradient-to-br from-purple-600 via-violet-700 to-purple-900 text-white",
  amber: "bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white",
  orange: "bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 text-white",
  gold: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white",
  slate: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white",
};

function AnimatedNumber({ value }: { value: number | string | undefined }) {
  const targetNum = typeof value === "number" ? value : parseInt(String(value || "0"), 10) || 0;
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (isNaN(targetNum) || targetNum <= 0) {
      setDisplayVal(0);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.floor(easedProgress * targetNum));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayVal(targetNum);
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
}: MetricCardProps) {
  const gradientClass = gradientMap[accentColor] || gradientMap.navy;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-[16px] p-5 ${gradientClass} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-0`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 min-w-0 flex-1 pr-3">
          <p className="font-extrabold uppercase tracking-wider text-xs text-white/80 leading-snug break-words">
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

        {/* Prominent White Semi-Transparent Circle Badge */}
        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-white shadow-inner">
          <Icon className={isPrimary ? "h-6 w-6" : "h-5 w-5"} />
        </div>
      </div>
    </motion.div>
  );
}

export default MetricCard;
