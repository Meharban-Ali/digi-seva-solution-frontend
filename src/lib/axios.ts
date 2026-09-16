import axios from "axios";
import { useAuthStore } from "@/features/auth/authStore";

const getDynamicBaseURL = (): string => {
  let url = "http://localhost:8080";
  if (import.meta.env.VITE_API_BASE_URL) {
    url = import.meta.env.VITE_API_BASE_URL;
  } else if (import.meta.env.DEV && typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    url = `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return url.replace(/\/+$/, "");
};

export const apiClient = axios.create({
  baseURL: getDynamicBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach appropriate JWT Bearer token for protected requests
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isAdminApi = url.includes("/api/admin");
    const isCustomerApi = !isAdminApi && (url.includes("/api/customer") || url.startsWith("/customer"));

    const isAdminAuthRoute =
      url.includes("/api/admin/auth/login") ||
      url.includes("/api/admin/auth/verify-otp");

    const isCustomerAuthRoute =
      url.includes("/api/customer/auth/send-otp") ||
      url.includes("/api/customer/auth/verify-otp");

    if (isAdminApi && !isAdminAuthRoute) {
      const token = useAuthStore.getState().token || localStorage.getItem("digiseva_admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (isCustomerApi && !isCustomerAuthRoute) {
      const customerToken = localStorage.getItem("customer_token");
      if (customerToken) {
        config.headers.Authorization = `Bearer ${customerToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Scoped 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      const isAdminApi = url.includes("/api/admin");
      const isAdminAuthRoute =
        url.includes("/api/admin/auth/login") ||
        url.includes("/api/admin/auth/verify-otp");

      const isCustomerApi = !isAdminApi && (url.includes("/api/customer") || url.startsWith("/customer"));
      const isCustomerAuthRoute =
        url.includes("/api/customer/auth/send-otp") ||
        url.includes("/api/customer/auth/verify-otp");

      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

      if (isAdminApi && !isAdminAuthRoute) {
        useAuthStore.getState().logout();
        if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
          window.location.href = "/admin/login?reason=session_expired";
        }
      } else if (isCustomerApi && !isCustomerAuthRoute) {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_user");
        if (currentPath.startsWith("/customer") && currentPath !== "/customer/login") {
          window.location.href = "/customer/login?reason=session_expired";
        }
      }
    }
    return Promise.reject(error);
  }
);
