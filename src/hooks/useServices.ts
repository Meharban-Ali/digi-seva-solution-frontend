import { useQuery } from "@tanstack/react-query";
import { useApiLang } from "@/hooks/useApiLang";
import { getPublicServices, getPublicServiceById } from "@/features/services/servicesApi";
import { PublicService, ServiceCategory } from "@/types/service.types";

export function useServices(category?: ServiceCategory, featured?: boolean) {
  const lang = useApiLang();

  return useQuery<PublicService[]>({
    queryKey: ["services", lang, category || "ALL", featured ? "FEATURED" : "ALL_FEATURED"],
    queryFn: () => getPublicServices(lang, category, featured),
  });
}

export function useServiceDetail(id?: string | number) {
  const lang = useApiLang();

  return useQuery<PublicService>({
    queryKey: ["service", id, lang],
    queryFn: () => getPublicServiceById(id!, lang),
    enabled: !!id,
  });
}
