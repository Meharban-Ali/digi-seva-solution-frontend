import { useState, useEffect, useRef, useCallback } from "react";

interface UseIdleTimeoutOptions {
  idleTimeMs?: number; // Time before warning modal fires (default 5 minutes = 300,000 ms)
  warningTimeMs?: number; // Warning modal countdown duration (default 1 minute = 60,000 ms)
  onTimeout: () => void; // Callback executed when 1-minute warning countdown expires
}

export function useIdleTimeout({
  idleTimeMs = 5 * 60 * 1000,
  warningTimeMs = 60 * 1000,
  onTimeout,
}: UseIdleTimeoutOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(Math.floor(warningTimeMs / 1000));

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearTimers();
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      setRemainingSeconds(Math.floor(warningTimeMs / 1000));
    }, idleTimeMs);
  }, [idleTimeMs, warningTimeMs, clearTimers]);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    setRemainingSeconds(Math.floor(warningTimeMs / 1000));
    startIdleTimer();
  }, [warningTimeMs, startIdleTimer]);

  // Handle live 60-second countdown interval when isIdle is true
  useEffect(() => {
    if (!isIdle) return;

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimers();
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [isIdle, clearTimers]);

  // Event listeners for user activity (mousemove, mousedown, keydown, touchstart, scroll)
  useEffect(() => {
    let lastActivityTime = Date.now();

    const handleActivity = () => {
      // If warning modal is active, user activity does NOT auto-dismiss modal unless Stay Logged In is clicked
      if (isIdle) return;

      const now = Date.now();
      // Throttle activity resets to once per second
      if (now - lastActivityTime > 1000) {
        lastActivityTime = now;
        startIdleTimer();
      }
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    startIdleTimer();

    return () => {
      clearTimers();
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isIdle, startIdleTimer, clearTimers]);

  return {
    isIdle,
    remainingSeconds,
    resetIdleTimer,
  };
}

export default useIdleTimeout;
