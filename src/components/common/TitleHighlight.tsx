import React from "react";

interface TitleHighlightProps {
  children: React.ReactNode;
  className?: string;
}

/**
  Reusable Highlighter-style background highlight component for card titles.
  Uses soft brand accent orange tint (bg-orange-100/70) with dark text for contrast.
 */
export function TitleHighlight({ children, className = "" }: TitleHighlightProps) {
  return (
    <span
      className={`card-title-highlight group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:text-accent-dark ${className}`}
    >
      {children}
    </span>
  );
}

export default TitleHighlight;
