import { ServiceCategory } from "@/types/service.types";

export interface AdminServiceRequest {
  nameEn: string;
  nameHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  category: ServiceCategory;
  price?: number;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface AdminServiceResponse {
  id: number;
  name: string;
  description?: string;
  nameEn?: string;
  nameHi?: string;
  descriptionEn?: string;
  descriptionHi?: string;
  category: ServiceCategory;
  price?: number;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
