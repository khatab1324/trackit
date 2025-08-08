export interface MemoryViewInput {
  user_id: string;
  memory_id: string;
}

export interface MemoryViewResponse {
  success: boolean;
  message: string;
  viewCount?: number;
}