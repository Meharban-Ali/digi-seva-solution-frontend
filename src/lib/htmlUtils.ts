/**
 * Strips HTML tags from a rich text string to extract clean plain text.
 * Ideal for single-line teaser strips, card subtitles, and hero text previews.
 */
export function stripHtml(html: string | undefined | null): string {
  if (!html) return "";

  // Use DOMParser if available in browser context for safe, accurate HTML parsing
  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = doc.body.textContent || "";
      return text.trim();
    } catch {
      // Fallback if parsing fails
    }
  }

  // Regex fallback stripping all HTML tags
  return html.replace(/<[^>]*>?/gm, "").trim();
}
