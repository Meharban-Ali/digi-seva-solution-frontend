import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { useTranslation } from "react-i18next";

interface ErrorAlertProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void | Promise<unknown>;
  className?: string;
}

export function ErrorAlert({
  error,
  message,
  onRetry,
  className = "",
}: ErrorAlertProps) {
  const { t } = useTranslation();
  const [retrying, setRetrying] = useState(false);

  const displayMessage = error
    ? getDiagnosticErrorMessage(error, message)
    : message || t("common.error");

  const handleRetry = async () => {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Card className={`bg-rose-50/90 border-rose-200 shadow-xs ${className}`}>
      <CardContent className="p-4 sm:p-5 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-rose-900 leading-relaxed">
            {displayMessage}
          </p>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={retrying}
              className="text-xs border-rose-300 text-rose-800 hover:bg-rose-100 font-bold flex items-center gap-1.5 mt-1"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
              <span>{retrying ? t("errors.retrying", "Retrying...") : t("errors.tryAgain", "Try Again")}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ErrorAlert;
