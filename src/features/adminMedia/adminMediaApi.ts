import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { AdminMediaResponse, MediaType } from "@/types/adminMedia.types";

export async function getAdminMedia(
  type?: MediaType,
  page = 0,
  size = 20
): Promise<PageResponse<AdminMediaResponse>> {
  const params: Record<string, unknown> = { page, size };
  if (type) params.type = type;

  const response = await apiClient.get<ApiResponse<PageResponse<AdminMediaResponse>>>(
    "/api/admin/media",
    { params }
  );
  return response.data.data;
}

export async function uploadAdminMedia(
  formData: FormData,
  onUploadProgress?: (percent: number) => void
): Promise<AdminMediaResponse> {
  const response = await apiClient.post<ApiResponse<AdminMediaResponse>>(
    "/api/admin/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress?.(percent);
        }
      },
    }
  );
  return response.data.data;
}

export async function deleteAdminMedia(id: number): Promise<string> {
  const response = await apiClient.delete<ApiResponse<string>>(`/api/admin/media/${id}`);
  return response.data.message;
}
