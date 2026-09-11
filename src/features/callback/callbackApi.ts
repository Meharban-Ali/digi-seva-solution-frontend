import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { CallbackRequest, CallbackResponse } from "@/types/callback.types";

export async function submitCallbackRequest(
  data: CallbackRequest
): Promise<CallbackResponse> {
  const response = await apiClient.post<ApiResponse<CallbackResponse>>("/api/callback", data);
  return response.data.data;
}

export async function getAdminCallbacks(
  status?: string,
  page = 0,
  size = 10
): Promise<PageResponse<CallbackResponse>> {
  const params: Record<string, unknown> = { page, size };
  if (status && status !== "ALL") params.status = status;

  const response = await apiClient.get<ApiResponse<PageResponse<CallbackResponse>>>(
    "/api/admin/callbacks",
    { params }
  );
  return response.data.data;
}

export async function updateAdminCallbackStatus(
  id: number,
  status: "PENDING" | "CALLED" | "CANCELLED"
): Promise<CallbackResponse> {
  const response = await apiClient.patch<ApiResponse<CallbackResponse>>(
    `/api/admin/callbacks/${id}/status`,
    { status }
  );
  return response.data.data;
}
