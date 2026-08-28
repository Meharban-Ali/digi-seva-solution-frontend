import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { refreshAdminToken } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 Minutes Idle Limit (OWASP)
const WARNING_WINDOW_MS = 30 * 1000; // 30 Seconds Countdown Warning
const WARN_START_MS = IDLE_TIMEOUT_MS - WARNING_WINDOW_MS; // 4 Minutes 30 Seconds

const LAST_ACTIVITY_KEY = "digiseva_admin_last_activity";
const BROADCAST_CHANNEL_NAME = "digiseva_admin_session_channel";

export function SessionTimeoutManager() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth, logout } = useAuthStore();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const channelRef = useRef<BroadcastChannel | null>(null);

  const performLogout = useCallback(
    (reason: "inactivity" | "session_expired" | "absolute_limit" | "manual" = "inactivity") => {
      logout();
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "LOGOUT" });
      }
      setIsWarningOpen(false);
      navigate(`/admin/login?reason=${reason}`, { replace: true });
    },
    [logout, navigate]
  );

  const handleUserActivity = useCallback(() => {
    // Only register activity if warning modal is NOT active
    if (isWarningOpen) return;

    const now = Date.now();
    // Throttle activity updates (max once every 2 seconds) to save CPU/storage I/O
    if (now - lastActivityRef.current > 2000) {
      lastActivityRef.current = now;
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
      } catch {
        // Fallback if localStorage quota error
      }
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "ACTIVITY", timestamp: now });
      }
    }
  }, [isWarningOpen]);

  const handleStayLoggedIn = async () => {
    setIsRefreshing(true);
    try {
      // Trigger real, legitimate backend re-authentication refresh call
      const authData = await refreshAdminToken();
      const token = authData.accessToken || authData.token || "";
      const user = authData.user || authData.adminUser;

      if (!token || !user) {
        throw new Error("Invalid token refresh response from server.");
      }

      setAuth(token, user);

      const now = Date.now();
      lastActivityRef.current = now;
      localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

      if (channelRef.current) {
        channelRef.current.postMessage({ type: "SESSION_REFRESHED", timestamp: now });
      }

      setIsWarningOpen(false);
      toast.success("Session extended successfully.");
    } catch (err) {
      toast.error("Failed to extend session. Token may be expired.");
      performLogout("session_expired");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 1. Setup multi-tab BroadcastChannel & LocalStorage Event Sync
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initialize last activity timestamp
    const storedLastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (storedLastActivity) {
      const parsed = parseInt(storedLastActivity, 10);
      if (!isNaN(parsed) && parsed <= Date.now()) {
        lastActivityRef.current = parsed;
      }
    } else {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }

    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === "ACTIVITY" || event.data.type === "SESSION_REFRESHED") {
          lastActivityRef.current = event.data.timestamp || Date.now();
          setIsWarningOpen(false);
        } else if (event.data.type === "LOGOUT") {
          logout();
          navigate("/admin/login?reason=inactivity", { replace: true });
        }
      };
    }

    // Storage event fallback for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed)) {
          lastActivityRef.current = parsed;
          setIsWarningOpen(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [isAuthenticated, logout, navigate]);

  // 2. Attach genuine user DOM interaction event listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ["click", "keydown", "touchstart", "pointerdown", "scroll"];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [isAuthenticated, handleUserActivity]);

  // 3. Ticker loop: Evaluates idle duration every 1 second
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const idleMs = now - lastActivityRef.current;

      if (idleMs >= IDLE_TIMEOUT_MS) {
        // Idle timeout reached (5 minutes) -> Auto Logout
        performLogout("inactivity");
      } else if (idleMs >= WARN_START_MS) {
        // Warning window reached (after 4 min 30 sec) -> Show warning countdown
        const remaining = Math.max(0, Math.ceil((IDLE_TIMEOUT_MS - idleMs) / 1000));
        setSecondsRemaining(remaining);
        setIsWarningOpen(true);
      } else {
        // User interacted or session refreshed -> Hide warning modal
        if (isWarningOpen) {
          setIsWarningOpen(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isWarningOpen, performLogout]);

  if (!isAuthenticated || !isWarningOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-100 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white tracking-tight">Session Timeout Warning</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have been inactive for over 4.5 minutes. For security compliance, your admin session will automatically log out.
            </p>
          </div>
        </div>

        {/* Live Countdown Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Time remaining:</span>
          </div>
          <span className="font-mono font-extrabold text-2xl text-amber-400">
            00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
          </span>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => performLogout("manual")}
            disabled={isRefreshing}
            className="flex-1 font-bold border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Log Out Now
          </Button>

          <Button
            type="button"
            onClick={handleStayLoggedIn}
            disabled={isRefreshing}
            className="flex-1 font-bold bg-accent hover:bg-accent-dark text-white shadow-md"
          >
            {isRefreshing ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </span>
            ) : (
              "Stay Logged In"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutManager;
