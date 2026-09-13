export interface TestimonialResponse {
  id: number;
  customerName: string;
  customerInitial: string;
  reviewEn: string;
  reviewHi?: string;
  serviceName?: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRequest {
  customerName: string;
  customerInitial?: string;
  reviewEn: string;
  reviewHi?: string;
  serviceName?: string;
  rating: number;
  isPublished?: boolean;
  displayOrder?: number;
}
