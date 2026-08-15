import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { AdminContentRequest, AdminContentResponse, ContentSection } from "@/types/adminContent.types";

export async function getAdminContent(
  section?: ContentSection,
  page = 0,
  size = 10
): Promise<PageResponse<AdminContentResponse>> {
  const params: Record<string, unknown> = { page, size };
  if (section) params.section = section;

  const response = await apiClient.get<ApiResponse<PageResponse<AdminContentResponse>>>(
    "/api/admin/content",
    { params }
  );
  return response.data.data;
}

export async function createAdminContent(
  data: AdminContentRequest
): Promise<AdminContentResponse> {
  const response = await apiClient.post<ApiResponse<AdminContentResponse>>(
    "/api/admin/content",
    data
  );
  return response.data.data;
}

export async function updateAdminContent(
  id: number,
  data: AdminContentRequest
): Promise<AdminContentResponse> {
  const response = await apiClient.put<ApiResponse<AdminContentResponse>>(
    `/api/admin/content/${id}`,
    data
  );
  return response.data.data;
}

export async function publishAdminContent(id: number): Promise<AdminContentResponse> {
  const response = await apiClient.patch<ApiResponse<AdminContentResponse>>(
    `/api/admin/content/${id}/publish`
  );
  return response.data.data;
}

export async function unpublishAdminContent(id: number): Promise<AdminContentResponse> {
  const response = await apiClient.patch<ApiResponse<AdminContentResponse>>(
    `/api/admin/content/${id}/unpublish`
  );
  return response.data.data;
}

export async function deleteAdminContent(id: number): Promise<string> {
  const response = await apiClient.delete<ApiResponse<string>>(`/api/admin/content/${id}`);
  return response.data.message;
}
