export interface MemoryLikeInput {
  user_id: string;
  memory_id: string;
}

export interface MemoryLikeResponse {
  success: boolean;
  message: string;
  isLiked?: boolean;
}
