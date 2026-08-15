import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminContent,
  createAdminContent,
  updateAdminContent,
  publishAdminContent,
  unpublishAdminContent,
  deleteAdminContent,
} from "@/features/adminContent/adminContentApi";
import { AdminContentRequest, ContentSection } from "@/types/adminContent.types";

export function useAdminContentPage(section?: ContentSection, page = 0, size = 10) {
  return useQuery({
    queryKey: ["adminContentPage", section, page, size],
    queryFn: () => getAdminContent(section, page, size),
  });
}

export function useCreateAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminContentRequest) => createAdminContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContentPage"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useUpdateAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminContentRequest }) =>
      updateAdminContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContentPage"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function usePublishAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishAdminContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContentPage"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useUnpublishAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => unpublishAdminContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContentPage"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteAdminContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContentPage"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
