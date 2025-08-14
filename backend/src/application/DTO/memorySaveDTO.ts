export interface BookmarkInput {
  user_id: string;
  memory_id: string;
}

export interface BookmarkResponse {
  success: boolean;
  message: string;
  isBookmarked?: boolean;
}

export interface BookmarkedMemory {
  id: string;
  memory_id: string;
  saved_at: Date;
  
    
    title: string;
    description?: string;
    content_url: string;
    content_type: string;
    latitude: number;
    longitude: number;
    isPublic: boolean;
    created_at: Date;
      user: {
    user_id: string;
    username: string;
  };
}
