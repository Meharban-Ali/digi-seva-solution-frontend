export type DeliveryMode = "VISIT_REQUIRED" | "ONLINE";

export interface PublicService {
  id: number;
  name: string;
  description: string;
  deliveryMode: DeliveryMode;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  categoryIcon?: string | null;
  price?: number;
  imageUrl?: string;
  displayOrder: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export type ServiceResponse = PublicService;
