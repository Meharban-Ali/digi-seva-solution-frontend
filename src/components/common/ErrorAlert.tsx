import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorAlertProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className = "",
}: ErrorAlertProps) {
  return (
    <Card className={`bg-rose-50 border-rose-200 shadow-xs ${className}`}>
      <CardContent className="p-5 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <p className="text-xs font-semibold text-rose-800">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs border-rose-300 text-rose-700 hover:bg-rose-100"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ErrorAlert;
