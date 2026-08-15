import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from "@/features/adminServices/adminServicesApi";
import { AdminServiceRequest } from "@/types/adminService.types";

export function useAdminServicesPage(page = 0, size = 10) {
  return useQuery({
    queryKey: ["adminServicesPage", page, size],
    queryFn: () => getAdminServices(page, size),
  });
}

export function useCreateAdminService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminServiceRequest) => createAdminService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServicesPage"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateAdminService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminServiceRequest }) =>
      updateAdminService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServicesPage"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteAdminService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServicesPage"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
