import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  icon: LucideIcon;
  isLoading?: boolean;
  isError?: boolean;
  accentColor?: "navy" | "gold" | "emerald" | "indigo" | "rose" | "slate";
  subtitle?: string;
}

const colorMap = {
  navy: {
    bg: "bg-blue-50/80",
    border: "border-blue-200/80",
    text: "text-[#0B2046]",
    badge: "bg-blue-100 text-[#0B2046]",
  },
  gold: {
    bg: "bg-amber-50/80",
    border: "border-amber-200/80",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-800",
  },
  emerald: {
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/80",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
  },
  indigo: {
    bg: "bg-indigo-50/80",
    border: "border-indigo-200/80",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-800",
  },
  rose: {
    bg: "bg-rose-50/80",
    border: "border-rose-200/80",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-800",
  },
  slate: {
    bg: "bg-slate-100/80",
    border: "border-slate-200",
    text: "text-slate-700",
    badge: "bg-slate-200 text-slate-800",
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
}: MetricCardProps) {
  const styles = colorMap[accentColor];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white rounded-xl hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1.5 min-w-0 flex-1 pr-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-md mt-1" />
          ) : isError ? (
            <p className="text-xs font-bold text-rose-500">Error</p>
          ) : (
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                {value ?? 0}
              </span>
              {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${styles.bg} ${styles.border} border shrink-0 ${styles.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default MetricCard;
