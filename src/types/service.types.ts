export type ServiceCategory = "VISIT_REQUIRED" | "ONLINE";

export interface PublicService {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  price?: number;
  imageUrl?: string;
  displayOrder: number;
  isActive?: boolean;
}

export type ServiceResponse = PublicService;
