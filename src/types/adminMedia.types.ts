export type MediaType = "IMAGE" | "AUDIO" | "VIDEO";

export interface AdminMediaResponse {
  id: number;
  type: MediaType;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  title?: string;
  fileSizeBytes?: number;
  uploadedBy?: number;
  uploadedAt: string;
}
