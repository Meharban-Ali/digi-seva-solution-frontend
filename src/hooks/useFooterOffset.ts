import { useState, useEffect } from "react";

/**
 * Custom React hook that calculates viewport distance to the <footer> element on scroll/resize.
 * When the footer is visible in the viewport, the bottom offset is dynamically increased
 * so floating action buttons (CallbackWidget, WhatsAppButton) ride up and never overlap footer content.
 */
export function useFooterOffset(defaultBottomPx: number = 24) {
  const [bottomPx, setBottomPx] = useState(defaultBottomPx);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setBottomPx(defaultBottomPx);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Distance from top of footer to bottom of viewport
      const distanceToBottom = viewportHeight - footerRect.top;

      if (distanceToBottom > 0) {
        // Footer is visible in viewport! Push button up above footer + default gap
        setBottomPx(distanceToBottom + defaultBottomPx);
      } else {
        setBottomPx(defaultBottomPx);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [defaultBottomPx]);

  return bottomPx;
}

export default useFooterOffset;
