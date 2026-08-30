import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type MetricAccent = "navy" | "gold" | "emerald" | "indigo" | "rose" | "slate";

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

const colorMap: Record<
  MetricAccent,
  { bg: string; border: string; text: string; ring: string; primaryBg: string }
> = {
  navy: {
    bg: "bg-blue-50/80 text-[#0B2046]",
    border: "border-blue-200/60",
    text: "text-[#0B2046]",
    ring: "ring-blue-500/10",
    primaryBg: "bg-gradient-to-br from-white via-blue-50/30 to-slate-50/80 border-blue-200/80",
  },
  gold: {
    bg: "bg-amber-50/90 text-amber-700",
    border: "border-amber-200/70",
    text: "text-amber-700",
    ring: "ring-amber-500/10",
    primaryBg: "bg-gradient-to-br from-white via-amber-50/30 to-slate-50/80 border-amber-200/80",
  },
  emerald: {
    bg: "bg-emerald-50/90 text-emerald-700",
    border: "border-emerald-200/70",
    text: "text-emerald-700",
    ring: "ring-emerald-500/10",
    primaryBg: "bg-gradient-to-br from-white via-emerald-50/30 to-slate-50/80 border-emerald-200/80",
  },
  indigo: {
    bg: "bg-indigo-50/90 text-indigo-700",
    border: "border-indigo-200/70",
    text: "text-indigo-700",
    ring: "ring-indigo-500/10",
    primaryBg: "bg-gradient-to-br from-white via-indigo-50/30 to-slate-50/80 border-indigo-200/80",
  },
  rose: {
    bg: "bg-rose-50/90 text-rose-700",
    border: "border-rose-200/70",
    text: "text-rose-700",
    ring: "ring-rose-500/10",
    primaryBg: "bg-gradient-to-br from-white via-rose-50/30 to-slate-50/80 border-rose-200/80",
  },
  slate: {
    bg: "bg-slate-100 text-slate-700",
    border: "border-slate-200/80",
    text: "text-slate-700",
    ring: "ring-slate-500/10",
    primaryBg: "bg-white border-slate-200",
  },
};

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
  const styles = colorMap[accentColor];

  return (
    <Card
      className={`rounded-xl transition-all duration-200 shadow-xs hover:shadow-md ${
        isPrimary
          ? `${styles.primaryBg} border-2 relative overflow-hidden`
          : "bg-white border border-slate-200/80"
      }`}
    >
      <CardContent className={`flex items-start justify-between ${isPrimary ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}>
        <div className="space-y-1.5 min-w-0 flex-1 pr-2">
          {/* Label: NO truncation, clean wrapping across lines */}
          <p
            className={`font-semibold uppercase tracking-wider leading-snug break-words ${
              isPrimary ? "text-xs text-slate-600 font-bold" : "text-[11px] text-slate-500"
            }`}
          >
            {title}
          </p>

          {isLoading ? (
            <div className="h-8 w-24 bg-slate-200/80 animate-pulse rounded-md mt-1" />
          ) : isError ? (
            <p className="text-xs font-bold text-rose-600 mt-1">Unable to load</p>
          ) : (
            <div className="flex items-baseline space-x-2 pt-0.5">
              <span
                className={`font-mono font-black text-slate-900 tracking-tight ${
                  isPrimary ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {value ?? 0}
              </span>
              {subtitle && (
                <span className="text-xs text-slate-500 font-semibold font-mono">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon Badge */}
        <div
          className={`p-2.5 rounded-xl ${styles.bg} ${styles.border} border shrink-0 ${styles.text} ${
            isPrimary ? "shadow-xs" : ""
          }`}
        >
          <Icon className={isPrimary ? "h-6 w-6" : "h-5 w-5"} />
        </div>
      </CardContent>
    </Card>
  );
}

export default MetricCard;
