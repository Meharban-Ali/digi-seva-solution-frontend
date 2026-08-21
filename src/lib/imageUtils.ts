/**
 * Optimizes Cloudinary URLs on-the-fly by adding format/quality and width transformation parameters.
 * If the URL is not a Cloudinary upload URL (or SVG format), it returns the original URL unchanged.
 *
 * Example:
 * Input:  https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
 * Output: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600,c_fill/v1234/sample.jpg
 */
export function getOptimizedImageUrl(url?: string | null, width = 600): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "";
  }

  const trimmedUrl = url.trim();

  // Skip SVGs or non-Cloudinary URLs
  if (trimmedUrl.endsWith(".svg") || !trimmedUrl.includes("res.cloudinary.com") || !trimmedUrl.includes("/upload/")) {
    return trimmedUrl;
  }

  // Already transformed
  if (trimmedUrl.includes("/upload/f_auto,q_auto") || trimmedUrl.includes("/upload/c_")) {
    return trimmedUrl;
  }

  const transformParams = `f_auto,q_auto,w_${width},c_fill`;
  return trimmedUrl.replace("/upload/", `/upload/${transformParams}/`);
}
