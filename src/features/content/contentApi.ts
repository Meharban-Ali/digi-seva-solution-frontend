import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { PublicContent, ContentSection } from "@/types/content.types";

export async function getPublicContentBlocks(
  section?: ContentSection,
  lang: string = "en"
): Promise<PublicContent[]> {
  const params: Record<string, string> = { lang };
  if (section) {
    params.section = section;
  }

  const response = await apiClient.get<ApiResponse<PublicContent[]>>("/api/content", { params });
  return response.data.data;
}

export async function getPublicContentById(
  id: string | number,
  lang: string = "en"
): Promise<PublicContent> {
  const response = await apiClient.get<ApiResponse<PublicContent>>(`/api/content/${id}`, {
    params: { lang },
  });
  return response.data.data;
}
