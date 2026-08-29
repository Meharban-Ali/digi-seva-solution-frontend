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
  const isIdleRef = useRef(isIdle);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    isIdleRef.current = isIdle;
  }, [isIdle]);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Start the 5-minute idle timer
  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      setRemainingSeconds(Math.floor(warningTimeMs / 1000));
    }, idleTimeMs);
  }, [idleTimeMs, warningTimeMs, clearIdleTimer]);

  // Reset the timer back to 5 minutes (e.g. when "Stay Logged In" is clicked)
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    clearCountdown();
    setRemainingSeconds(Math.floor(warningTimeMs / 1000));
    startIdleTimer();
  }, [warningTimeMs, startIdleTimer, clearCountdown]);

  // Countdown timer effect (runs when isIdle is true)
  useEffect(() => {
    if (!isIdle) {
      clearCountdown();
      return;
    }

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearCountdown();
          onTimeoutRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      clearCountdown();
    };
  }, [isIdle, clearCountdown]);

  // Intentional user activity listeners (mousedown, keydown, touchstart, click)
  useEffect(() => {
    let lastReset = Date.now();

    const handleUserActivity = () => {
      // Ignore background movements if warning modal is active
      if (isIdleRef.current) return;

      const now = Date.now();
      // Throttle resets to once every 2 seconds
      if (now - lastReset > 2000) {
        lastReset = now;
        startIdleTimer();
      }
    };

    // Intentional user actions (excludes scroll and raw mousemove)
    const events = ["mousedown", "keydown", "touchstart", "click"];
    events.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Initial timer launch on hook mount
    startIdleTimer();

    return () => {
      clearIdleTimer();
      clearCountdown();
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
    };
  }, [startIdleTimer, clearIdleTimer, clearCountdown]);

  return {
    isIdle,
    remainingSeconds,
    resetIdleTimer,
  };
}

export default useIdleTimeout;
