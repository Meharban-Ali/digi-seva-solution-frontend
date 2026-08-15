interface SkeletonLoaderProps {
  count?: number;
  type?: "card" | "table" | "text";
}

export function SkeletonLoader({ count = 4, type = "card" }: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (type === "table") {
    return (
      <div className="space-y-3 p-4">
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-slate-200/70 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-2 p-2">
        {items.map((_, i) => (
          <div key={i} className="h-4 bg-slate-200/70 rounded animate-pulse w-5/6" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div key={i} className="h-56 rounded-xl bg-slate-200/70 animate-pulse border border-slate-200" />
      ))}
    </div>
  );
}

export default SkeletonLoader;
