import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { CustomerAuthResponse } from "@/types/customer.types";

export async function sendCustomerOtp(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>("/api/customer/auth/send-otp", { email });
  return response.data;
}

export async function verifyCustomerOtp(
  email: string,
  otpCode: string,
  name?: string
): Promise<ApiResponse<CustomerAuthResponse>> {
  const response = await apiClient.post<ApiResponse<CustomerAuthResponse>>("/api/customer/auth/verify-otp", {
    email,
    otpCode,
    name,
  });
  return response.data;
}

export async function logoutCustomerApi(email?: string): Promise<void> {
  try {
    await apiClient.post("/api/customer/auth/logout", { email });
  } catch {
    // Ignore network error on logout
  }
}
