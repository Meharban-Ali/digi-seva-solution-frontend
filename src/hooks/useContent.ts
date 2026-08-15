import { useQuery } from "@tanstack/react-query";
import { useApiLang } from "@/hooks/useApiLang";
import { getPublicContentBlocks, getPublicContentById } from "@/features/content/contentApi";
import { PublicContent, ContentSection } from "@/types/content.types";

export function useContent(section?: ContentSection) {
  const lang = useApiLang();

  return useQuery<PublicContent[]>({
    queryKey: ["content", section || "ALL", lang],
    queryFn: () => getPublicContentBlocks(section, lang),
  });
}

export function useContentDetail(id?: string | number) {
  const lang = useApiLang();

  return useQuery<PublicContent>({
    queryKey: ["contentDetail", id, lang],
    queryFn: () => getPublicContentById(id!, lang),
    enabled: !!id,
  });
}
