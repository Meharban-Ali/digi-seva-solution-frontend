import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { CategoryResponse } from "@/types/category.types";

export async function getPublicCategories(lang: string = "en"): Promise<CategoryResponse[]> {
  const response = await apiClient.get<ApiResponse<CategoryResponse[]>>("/api/categories", {
    params: { lang },
  });
  return response.data.data;
}

export async function getPublicCategoryBySlug(slug: string, lang: string = "en"): Promise<CategoryResponse> {
  const response = await apiClient.get<ApiResponse<CategoryResponse>>(`/api/categories/slug/${slug}`, {
    params: { lang },
  });
  return response.data.data;
}
