export interface Project {
  id: number;
  titleEn: string;
  titleHi?: string;
  title: string;
  descriptionEn?: string;
  descriptionHi?: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  categoryTag?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  titleEn: string;
  titleHi?: string;
  descriptionEn?: string;
  descriptionHi?: string;
  imageUrl?: string;
  projectUrl?: string;
  categoryTag?: string;
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}
