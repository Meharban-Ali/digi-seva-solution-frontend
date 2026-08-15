import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminMedia, uploadAdminMedia, deleteAdminMedia } from "@/features/adminMedia/adminMediaApi";
import { MediaType } from "@/types/adminMedia.types";

export function useAdminMedia(type?: MediaType, page = 0, size = 20) {
  return useQuery({
    queryKey: ["adminMedia", type, page, size],
    queryFn: () => getAdminMedia(type, page, size),
  });
}

export function useUploadAdminMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, onUploadProgress }: { formData: FormData; onUploadProgress?: (p: number) => void }) =>
      uploadAdminMedia(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
    },
  });
}

export function useDeleteAdminMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMedia"] });
    },
  });
}
