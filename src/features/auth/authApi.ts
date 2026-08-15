import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  LoginRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  JwtAuthResponse,
  AdminUserDto,
} from "@/types/auth.types";

export async function initiateAdminLogin(data: LoginRequest): Promise<string> {
  const response = await apiClient.post<ApiResponse<string>>("/api/admin/auth/login", data);
  return response.data.message;
}

export async function verifyAdminOtp(data: VerifyOtpRequest): Promise<JwtAuthResponse> {
  const response = await apiClient.post<ApiResponse<unknown>>("/api/admin/auth/verify-otp", data);
  const rawData = response.data.data as Record<string, unknown>;

  // Extract raw user object (backend returns 'user')
  const rawUser = (rawData.user || rawData.adminUser) as Record<string, unknown> | undefined;

  const isFirstLoginVal =
    rawUser?.isFirstLogin !== undefined
      ? Boolean(rawUser.isFirstLogin)
      : rawUser?.firstLogin !== undefined
      ? Boolean(rawUser.firstLogin)
      : false;

  const user: AdminUserDto = {
    id: Number(rawUser?.id || 0),
    email: String(rawUser?.email || ""),
    fullName: String(rawUser?.fullName || ""),
    isFirstLogin: isFirstLoginVal,
    firstLogin: isFirstLoginVal,
  };

  const tokenStr = String(rawData.accessToken || rawData.token || "");
  const expiresMs = Number(rawData.expiresInMs || rawData.expirationMs || 0);

  return {
    accessToken: tokenStr,
    token: tokenStr,
    tokenType: String(rawData.tokenType || "Bearer"),
    expiresInMs: expiresMs,
    expirationMs: expiresMs,
    user,
    adminUser: user,
  };
}

export async function changeAdminPassword(data: ChangePasswordRequest): Promise<string> {
  const response = await apiClient.post<ApiResponse<string>>("/api/admin/auth/change-password", data);
  return response.data.message;
}
