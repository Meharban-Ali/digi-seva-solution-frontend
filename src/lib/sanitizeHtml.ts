import DOMPurify from "dompurify";

/**
 * Sanitizes rich text HTML content to prevent XSS attacks while preserving formatting.
 *
 * @param dirtyHtml - Unsanitized HTML string
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirtyHtml?: string | null): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string" || dirtyHtml.trim() === "") {
    return "";
  }

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "p", "b", "i", "em", "strong", "a", "ul", "ol", "li", "br",
      "span", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
    ADD_ATTR: ["target"],
  });
}

export default sanitizeHtml;
