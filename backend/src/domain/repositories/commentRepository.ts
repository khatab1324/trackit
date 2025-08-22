import { 
  AddCommentInput, 
  AddCommentResponse, 
  LikeCommentInput, 
  LikeCommentResponse,
  DeleteCommentInput,
  DeleteCommentResponse,
  EditCommentInput,
  EditCommentResponse
} from "../../application/DTO/commentDTO";

export interface CommentRepository {
  addComment(input: AddCommentInput): Promise<AddCommentResponse>;
  getCommentsByMemoryId(memoryId: string, currentUserId?: string): Promise<any[]>;
  likeComment(input: LikeCommentInput): Promise<LikeCommentResponse>;
  unlikeComment(input: LikeCommentInput): Promise<LikeCommentResponse>;
  deleteComment(input: DeleteCommentInput): Promise<DeleteCommentResponse>;
  editComment(input: EditCommentInput): Promise<EditCommentResponse>;
  isCommentLikedByUser(userId: string, commentId: string): Promise<boolean>;
}