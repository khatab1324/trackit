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
  memory: {
    id: string;
    content_url: string;
  };
}
