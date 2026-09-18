import { Card } from "@/components/ui/card";

interface SkeletonLoaderProps {
  count?: number;
  type?: "card" | "table" | "text" | "banner" | "detail" | "stats";
  className?: string;
}

export function SkeletonLoader({ count = 4, type = "card", className = "" }: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  // 1. Table skeleton for admin data tables
  if (type === "table") {
    return (
      <div className={`space-y-3 p-4 ${className}`}>
        <div className="h-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-lg animate-pulse motion-reduce:animate-none w-full" />
        {items.map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-100/90 dark:bg-slate-800/50 rounded-lg animate-pulse motion-reduce:animate-none border border-slate-200/60 dark:border-slate-800 flex items-center px-4 space-x-4"
          >
            <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded w-1/4" />
            </div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Text line skeleton
  if (type === "text") {
    return (
      <div className={`space-y-2.5 p-2 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded animate-pulse motion-reduce:animate-none ${
              i % 2 === 0 ? "w-full" : "w-4/5"
            }`}
          />
        ))}
      </div>
    );
  }

  // 3. Hero banner skeleton for homepage
  if (type === "banner") {
    return (
      <div className={`w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-r from-slate-200/90 via-slate-100 to-slate-200/90 dark:from-slate-900 dark:to-slate-800 animate-pulse motion-reduce:animate-none border border-slate-200/80 p-8 space-y-6 flex flex-col justify-center ${className}`}>
        <div className="h-6 w-48 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="h-10 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        <div className="h-4 w-2/3 bg-slate-300/70 dark:bg-slate-700/70 rounded" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-36 bg-orange-200/80 dark:bg-orange-950/80 rounded-xl" />
          <div className="h-11 w-36 bg-slate-300 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    );
  }

  // 4. Detail view skeleton (for ServiceDetailPage)
  if (type === "detail") {
    return (
      <div className={`max-w-4xl mx-auto space-y-6 p-4 ${className}`}>
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse motion-reduce:animate-none" />
        <Card className="border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-700 opacity-40" />
          </div>
          <div className="p-6 space-y-4 bg-slate-900 text-white">
            <div className="h-8 w-2/3 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-800/80 rounded animate-pulse" />
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  // 5. Stats card skeleton
  if (type === "stats") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-3 animate-pulse motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-9 w-9 bg-slate-200 rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-slate-300 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  // 6. Default Card skeleton (for ServiceCard catalog items)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {items.map((_, i) => (
        <Card
          key={i}
          className="h-64 rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden p-5 flex flex-col justify-between space-y-4 animate-pulse motion-reduce:animate-none"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 bg-orange-100/80 border border-orange-200/60 rounded-full" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-5 bg-slate-200/90 rounded-md w-4/5" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 w-16 bg-slate-200 rounded-md" />
            <div className="h-8 w-20 bg-orange-500/20 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default SkeletonLoader;
