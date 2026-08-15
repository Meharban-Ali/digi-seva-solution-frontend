import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { AdminEnquiryResponse, EnquiryStatus } from "@/types/adminEnquiry.types";

export async function getAdminEnquiries(
  status?: EnquiryStatus,
  page = 0,
  size = 10
): Promise<PageResponse<AdminEnquiryResponse>> {
  const params: Record<string, unknown> = { page, size };
  if (status) params.status = status;

  const response = await apiClient.get<ApiResponse<PageResponse<AdminEnquiryResponse>>>(
    "/api/admin/enquiries",
    { params }
  );
  return response.data.data;
}

export async function updateAdminEnquiryStatus(
  id: number,
  status: EnquiryStatus
): Promise<AdminEnquiryResponse> {
  const response = await apiClient.patch<ApiResponse<AdminEnquiryResponse>>(
    `/api/admin/enquiries/${id}/status`,
    null,
    { params: { status } }
  );
  return response.data.data;
}
