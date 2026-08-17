import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { PublicService, ServiceCategory } from "@/types/service.types";

export async function getPublicServices(
  lang: string = "en",
  category?: ServiceCategory,
  featured?: boolean
): Promise<PublicService[]> {
  const params: Record<string, string | boolean> = { lang };
  if (category) {
    params.category = category;
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
