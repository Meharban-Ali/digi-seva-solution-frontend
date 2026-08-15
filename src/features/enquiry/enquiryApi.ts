import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { EnquiryRequest, EnquiryResponse } from "@/types/enquiry.types";

export async function submitPublicEnquiry(
  data: EnquiryRequest
): Promise<EnquiryResponse> {
  const response = await apiClient.post<ApiResponse<EnquiryResponse>>("/api/enquiries", data);
  return response.data.data;
}
