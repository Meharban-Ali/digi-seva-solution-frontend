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

// Request Interceptor: Attach JWT Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem("digiseva_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid infinite redirect loops on login endpoint failure
      const isLoginRequest = error.config?.url?.includes("/api/admin/auth/");
      if (!isLoginRequest) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
