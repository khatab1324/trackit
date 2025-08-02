export type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

export interface MemoryInput {
  user_id: string;
  title: string;
  description?: string;
  content_url: string;
  content_type: ContentType;
  latitude: string;
  longitude: string;
  isPublic: boolean;
}
export enum ContentType {
  Image = "image",
}
