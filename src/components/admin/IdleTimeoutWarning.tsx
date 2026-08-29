import { useTranslation } from "react-i18next";
import { AlertTriangle, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdleTimeoutWarningProps {
  isOpen: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

export function IdleTimeoutWarning({
  isOpen,
  remainingSeconds,
  onStayLoggedIn,
  onLogoutNow,
}: IdleTimeoutWarningProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header with Amber Warning Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
              {t("idleTimeout.warningTitle", "Session Expiring Soon")}
            </h3>
            <p className="text-xs text-amber-600 font-bold font-mono mt-0.5">
              {t("idleTimeout.countdown", { seconds: remainingSeconds })}
            </p>
          </div>
        </div>

        {/* Message Box */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          {t(
            "idleTimeout.warningMessage",
            "You have been inactive for 5 minutes. You will be automatically logged out in 1 minute. Click 'Stay Logged In' to continue your session."
          )}
        </p>

        {/* Live Warm Gold Progress Bar */}
        <div className="w-full bg-slate-100 border border-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(remainingSeconds / 60) * 100}%` }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-1 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogoutNow}
            className="border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-semibold text-xs flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("idleTimeout.logoutNow", "Logout Now")}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onStayLoggedIn}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("idleTimeout.stayLoggedIn", "Stay Logged In")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default IdleTimeoutWarning;
