import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Automatically scrolls window instantly to top (0, 0) on every route change.
 * Handles optional in-page anchor hash links (#section-id) cleanly.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If an in-page anchor hash link exists (e.g. #contact), scroll to target element
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView();
        return;
      }
    }

    // Default: Instant scroll to top left on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
