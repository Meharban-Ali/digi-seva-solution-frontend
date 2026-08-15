import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { AdminServiceRequest, AdminServiceResponse } from "@/types/adminService.types";

export async function getAdminServices(
  page = 0,
  size = 10
): Promise<PageResponse<AdminServiceResponse>> {
  const response = await apiClient.get<ApiResponse<PageResponse<AdminServiceResponse>>>(
    "/api/admin/services",
    { params: { page, size } }
  );
  return response.data.data;
}

export async function createAdminService(
  data: AdminServiceRequest
): Promise<AdminServiceResponse> {
  const response = await apiClient.post<ApiResponse<AdminServiceResponse>>(
    "/api/admin/services",
    data
  );
  return response.data.data;
}

export async function updateAdminService(
  id: number,
  data: AdminServiceRequest
): Promise<AdminServiceResponse> {
  const response = await apiClient.put<ApiResponse<AdminServiceResponse>>(
    `/api/admin/services/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteAdminService(id: number): Promise<string> {
  const response = await apiClient.delete<ApiResponse<string>>(`/api/admin/services/${id}`);
  return response.data.message;
}
