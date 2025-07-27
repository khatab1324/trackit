export interface Memory {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content_url: string;
  content_type: ContentType;
  latitude: number;
  longitude: number;
  isPublic: boolean;
  created_at: Date;
}
enum ContentType {
  Image = "image",
}
