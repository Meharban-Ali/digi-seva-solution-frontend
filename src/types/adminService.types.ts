import { DeliveryMode } from "@/types/service.types";

export interface AdminServiceRequest {
  nameEn: string;
  nameHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  deliveryMode: DeliveryMode;
  categoryId?: number | null;
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
  deliveryMode: DeliveryMode;
  categoryId?: number | null;
  categoryNameEn?: string | null;
  categoryNameHi?: string | null;
  categorySlug?: string | null;
  categoryIcon?: string | null;
  price?: number;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
