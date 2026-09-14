import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export interface AutoScrollTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Duration in seconds for full scroll cycle
}

/**
 * AutoScrollText Component
 * Automatically detects if text content overflows its container.
 * - If text fits: renders static text normally.
 * - If text overflows: scrolls smooth marquee-style right-to-left in a continuous loop.
 * - Pauses scrolling on hover.
 * - Respects prefers-reduced-motion OS accessibility settings.
 */
export function AutoScrollText({
  children,
  className = "",
  speed = 12,
}: AutoScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check system prefers-reduced-motion setting
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;
        setIsOverflowing(textWidth > containerWidth);
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [children]);

  if (prefersReducedMotion && isOverflowing) {
    return (
      <div className={`overflow-hidden text-ellipsis whitespace-nowrap ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap max-w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hidden element for measuring exact non-scrolling text width */}
      <span
        ref={textRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        {children}
      </span>

      {isOverflowing ? (
        <div className="inline-flex w-max">
          <motion.div
            className="inline-flex whitespace-nowrap items-center"
            initial={{ x: "0%" }}
            animate={isPaused ? { x: undefined } : { x: "-50%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: speed,
            }}
          >
            <span className="pr-8">{children}</span>
            <span className="pr-8" aria-hidden="true">
              {children}
            </span>
          </motion.div>
        </div>
      ) : (
        <span className="inline-block whitespace-nowrap">{children}</span>
      )}
    </div>
  );
}

export default AutoScrollText;
