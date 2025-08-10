export type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

export enum ContentType {
  Image = "image",
  Video = "video",
}

export type Memory = {
  id: string;
  content_type: string;
  content_url: string;
  count: string;
  description?: string;
  isFollowed: boolean;
  is_saved: boolean;
  lang: number; 
  long: number;
  num_comments: string;
  num_likes: string;
  userInfo: {
    user_id: string;
    username: string;
  };
};

export type MemoryInput = {
  user_id: string;
  content_type: ContentType | "image" | "video";
  content_url: string;
  latitude: number | string;     
  longitude: number | string;    
  title?: string;
  description?: string;
  isPublic?: boolean;
};
