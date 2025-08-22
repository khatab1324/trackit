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

export interface LikeCommentInput {
  user_id: string;
  comment_id: string;
}

export interface LikeCommentResponse {
  success: boolean;
  message: string;
  isLiked: boolean;
}

export interface DeleteCommentInput {
  user_id: string;
  comment_id: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

export interface EditCommentInput {
  user_id: string;
  comment_id: string;
  content: string;
}

export interface EditCommentResponse {
  success: boolean;
  message: string;
  commentId?: string;
}