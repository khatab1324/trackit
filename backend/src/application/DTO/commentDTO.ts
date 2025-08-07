export interface AddCommentInput {
  user_id: string;
  memory_id: string;
  content: string;
}

export interface AddCommentResponse {
  success: boolean;
  message: string;
  commentId?: string;
}