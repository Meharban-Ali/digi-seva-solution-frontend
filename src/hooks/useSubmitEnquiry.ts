import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { submitPublicEnquiry } from "@/features/enquiry/enquiryApi";
import { EnquiryRequest, EnquiryResponse } from "@/types/enquiry.types";
import { ApiResponse } from "@/types/api";

export function useSubmitEnquiry() {
  return useMutation<EnquiryResponse, AxiosError<ApiResponse<unknown>>, EnquiryRequest>({
    mutationFn: (data: EnquiryRequest) => submitPublicEnquiry(data),
  });
}

export default useSubmitEnquiry;
