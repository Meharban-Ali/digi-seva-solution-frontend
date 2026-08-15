import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminEnquiries, updateAdminEnquiryStatus } from "@/features/adminEnquiries/adminEnquiriesApi";
import { EnquiryStatus } from "@/types/adminEnquiry.types";

export function useAdminEnquiriesPage(status?: EnquiryStatus, page = 0, size = 10) {
  return useQuery({
    queryKey: ["adminEnquiriesPage", status, page, size],
    queryFn: () => getAdminEnquiries(status, page, size),
  });
}

export function useUpdateAdminEnquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: EnquiryStatus }) =>
      updateAdminEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiriesPage"] });
    },
  });
}
