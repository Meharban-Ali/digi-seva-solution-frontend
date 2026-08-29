import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import i18n from "@/i18n";

/**
 * Parses Axios/Network errors and returns clean, admin-friendly, localized error messages.
 * Technical details (such as CORS origins or endpoint URLs) are logged ONLY to the browser console.
 */
export function getDiagnosticErrorMessage(
  error: unknown,
  fallbackMessage?: string
): string {
  if (!error) return fallbackMessage || i18n.t("common.error");

  const axiosError = error as AxiosError<ApiResponse<unknown>>;

  // Log full technical details to browser console for developer inspection ONLY
  if (axiosError.config) {
    console.error(
      `[API Error Diagnostic] Endpoint: ${axiosError.config.url} | Method: ${axiosError.config.method?.toUpperCase()} | Status: ${
        axiosError.response?.status || "NO_RESPONSE"
      } | Code: ${axiosError.code || "N/A"} | Message: ${axiosError.message}`
    );
  }

  // 1. Backend Responded with HTTP Status (4xx, 5xx)
  if (axiosError.response) {
    const status = axiosError.response.status;
    const backendMessage = axiosError.response.data?.message;

    // Rate Limit (429)
    if (status === 429) {
      return backendMessage || "Too many requests. Please wait a moment before trying again.";
    }

    // Authentication / Permission Failure (401, 403)
    if (status === 401 || status === 403) {
      return backendMessage || i18n.t("errors.unauthorized", "Invalid credentials or authorization failed.");
    }

    // Server Error (500, 502, 503, 504)
    if (status >= 500) {
      return i18n.t("errors.serverError", "Server is temporarily unavailable. Please try again in a few minutes.");
    }

    // Client Validation / Request Error (400, 404, 422, etc.)
    if (status >= 400 && status < 500) {
      return backendMessage || fallbackMessage || "Request failed. Please check your details and try again.";
    }
  }

  // 2. Network / Connectivity Error (No response received or request aborted/failed)
  if (
    axiosError.code === "ERR_NETWORK" ||
    axiosError.code === "ECONNABORTED" ||
    axiosError.message === "Network Error" ||
    axiosError.request ||
    !axiosError.response
  ) {
    // Log developer CORS guidance ONLY in browser console
    if (typeof window !== "undefined") {
      console.warn(
        `[CORS/Network Notice] Target backend endpoint '${axiosError.config?.url}' was unreachable from origin '${window.location.origin}'. If backend is running, ensure '${window.location.origin}' is included in ALLOWED_ORIGINS.`
      );
    }

    return i18n.t("errors.networkError", "Internet connection issue detected. Please check your connection and try again.");
  }

  // 3. Fallback to standard message or provided fallback
  if (axiosError.message) {
    return axiosError.message;
  }

  return fallbackMessage || i18n.t("common.error");
}
