import { useQuery } from "@tanstack/react-query";
import { useApiLang } from "@/hooks/useApiLang";
import { getPublicServices, getPublicServiceById } from "@/features/services/servicesApi";
import { PublicService, DeliveryMode } from "@/types/service.types";

export function useServices(deliveryMode?: DeliveryMode, featured?: boolean) {
  const lang = useApiLang();

  return useQuery<PublicService[]>({
    queryKey: ["services", lang, deliveryMode || "ALL", featured ? "FEATURED" : "ALL_FEATURED"],
    queryFn: () => getPublicServices(lang, deliveryMode, featured),
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
