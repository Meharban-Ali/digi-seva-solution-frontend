import { useQuery } from "@tanstack/react-query";
import { useApiLang } from "@/hooks/useApiLang";
import { getPublicCategories, getPublicCategoryBySlug } from "@/features/categories/categoriesApi";
import { CategoryResponse } from "@/types/category.types";

export function useCategories() {
  const lang = useApiLang();

  return useQuery<CategoryResponse[]>({
    queryKey: ["categories", lang],
    queryFn: () => getPublicCategories(lang),
  });
}

export function useCategoryBySlug(slug?: string) {
  const lang = useApiLang();

  return useQuery<CategoryResponse>({
    queryKey: ["category", slug, lang],
    queryFn: () => getPublicCategoryBySlug(slug!, lang),
    enabled: !!slug,
  });
}
