import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { PublicService, DeliveryMode } from "@/types/service.types";

export async function getPublicServices(
  lang: string = "en",
  deliveryMode?: DeliveryMode,
  featured?: boolean
): Promise<PublicService[]> {
  const params: Record<string, string | boolean> = { lang };
  if (deliveryMode) {
    params.mode = deliveryMode;
  }
  if (featured !== undefined) {
    params.featured = featured;
  }

  const response = await apiClient.get<ApiResponse<PublicService[]>>("/api/services", { params });
  return response.data.data;
}

export async function getPublicServiceById(
  id: string | number,
  lang: string = "en"
): Promise<PublicService> {
  const response = await apiClient.get<ApiResponse<PublicService>>(`/api/services/${id}`, {
    params: { lang },
  });
  return response.data.data;
}
