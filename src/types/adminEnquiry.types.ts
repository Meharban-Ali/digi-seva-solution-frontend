export type EnquiryStatus = "NEW" | "CONTACTED" | "RESOLVED";

export interface AdminEnquiryResponse {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceId?: number;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}
