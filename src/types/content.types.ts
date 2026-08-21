export type ContentSection = "HOME_BANNER" | "ABOUT_US" | "ANNOUNCEMENT" | "OFFER" | "FAQ" | "WELCOME_POPUP";

export interface PublicContent {
  id: number;
  section: ContentSection;
  title: string;
  body: string;
  linkedMediaId?: number;
  displayOrder: number;
}
