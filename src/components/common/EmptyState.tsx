import { FileX, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileX,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`bg-slate-50/70 border-dashed border-slate-300 text-center py-12 ${className}`}>
      <CardContent className="space-y-3">
        <Icon className="h-12 w-12 text-slate-400 mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-700">{title}</p>
          {description && <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>}
        </div>
        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onClick={onAction} className="mt-2 font-semibold">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default EmptyState;
