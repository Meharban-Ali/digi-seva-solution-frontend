import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { CategoryResponse, CategoryRequest } from "@/types/category.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export async function getAdminCategories(): Promise<CategoryResponse[]> {
  const response = await apiClient.get<ApiResponse<CategoryResponse[]>>("/api/admin/categories");
  return response.data.data;
}

export async function getAdminCategoryById(id: number): Promise<CategoryResponse> {
  const response = await apiClient.get<ApiResponse<CategoryResponse>>(`/api/admin/categories/${id}`);
  return response.data.data;
}

export async function createAdminCategory(data: CategoryRequest): Promise<CategoryResponse> {
  const response = await apiClient.post<ApiResponse<CategoryResponse>>("/api/admin/categories", data);
  return response.data.data;
}

export async function updateAdminCategory(id: number, data: CategoryRequest): Promise<CategoryResponse> {
  const response = await apiClient.put<ApiResponse<CategoryResponse>>(`/api/admin/categories/${id}`, data);
  return response.data.data;
}

export async function deleteAdminCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/categories/${id}`);
}

export async function reorderAdminCategories(categoryIds: number[]): Promise<void> {
  await apiClient.put("/api/admin/categories/reorder", categoryIds);
}

// React Query Hooks
export function useAdminCategories() {
  return useQuery<CategoryResponse[]>({
    queryKey: ["adminCategories"],
    queryFn: getAdminCategories,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) => updateAdminCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
