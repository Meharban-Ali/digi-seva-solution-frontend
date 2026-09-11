export interface CallbackRequest {
  name: string;
  phone: string;
  preferredTime?: string;
}

export interface CallbackResponse {
  id: number;
  name: string;
  phone: string;
  preferredTime?: string;
  status: "PENDING" | "CALLED" | "CANCELLED";
  createdAt: string;
}
