export interface EnquiryRequest {
  name: string;
  phone: string;
  email?: string;
  serviceId?: number;
  message?: string;
}

export type EnquiryStatus = "NEW" | "CONTACTED" | "RESOLVED";

export interface EnquiryResponse {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceId?: number;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}
