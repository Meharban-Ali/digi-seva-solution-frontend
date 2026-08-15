import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";

/**
 * Diagnostic error helper that parses Axios errors and returns
 * clear, actionable error messages for CORS, Network drops, 4xx, and 5xx errors.
 */
export function getDiagnosticErrorMessage(
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred."
): string {
  if (!error) return fallbackMessage;

  const axiosError = error as AxiosError<ApiResponse<unknown>>;

  // 1. Backend responded with an HTTP status code (4xx, 5xx)
  if (axiosError.response) {
    const status = axiosError.response.status;
    const backendMessage = axiosError.response.data?.message;

    if (status === 429) {
      return backendMessage || "Too many requests. Please wait a moment before trying again.";
    }

    if (status === 401 || status === 403) {
      return backendMessage || "Access Denied: Request rejected due to security or permission restrictions.";
    }

    if (status >= 400 && status < 500) {
      return backendMessage || "Request Validation Failed: Please verify your input details.";
    }

    if (status >= 500) {
      return backendMessage || "Server Temporary Error: Database or backend service unavailable.";
    }
  }

  // 2. Request was made but no response received (CORS block or server down)
  if (axiosError.request || axiosError.message === "Network Error") {
    const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
    const isNetworkIP = currentHost !== "localhost" && currentHost !== "127.0.0.1" && currentHost !== "";

    if (isNetworkIP) {
      return `CORS / Network Restriction: Unable to connect to backend from network origin '${window.location.origin}'. Please add '${window.location.origin}' to ALLOWED_ORIGINS in backend configuration.`;
    }

    return "Server Connection Failed: Unable to reach the Digi Seva backend server (port 8080). Please verify backend service is active.";
  }

  // 3. Fallback standard error message
  if (axiosError.message) {
    return axiosError.message;
  }

  return fallbackMessage;
}
