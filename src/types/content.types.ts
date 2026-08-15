export type ContentSection = "HOME_BANNER" | "ABOUT_US" | "ANNOUNCEMENT" | "OFFER";

export interface PublicContent {
  id: number;
  section: ContentSection;
  title: string;
  body: string;
  linkedMediaId?: number;
  displayOrder: number;
}
