export interface CategoryResponse {
  id: number;
  nameEn: string;
  nameHi: string;
  name?: string; // Resolved single-language name for public consumption
  slug: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  serviceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  nameEn: string;
  nameHi: string;
  slug?: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
}
