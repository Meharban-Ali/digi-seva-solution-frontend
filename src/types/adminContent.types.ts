export type ContentSection = "HOME_BANNER" | "ABOUT_US" | "ANNOUNCEMENT" | "OFFER" | "FAQ" | "WELCOME_POPUP";
export type ContentStatus = "DRAFT" | "PUBLISHED";

export interface AdminContentRequest {
  section: ContentSection;
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
}

export interface AdminContentResponse {
  id: number;
  section: ContentSection;
  title?: string;
  body?: string;
  titleEn?: string;
  titleHi?: string;
  bodyEn?: string;
  bodyHi?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
