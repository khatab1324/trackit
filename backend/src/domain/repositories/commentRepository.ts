import { AddCommentInput, AddCommentResponse } from "../../application/DTO/commentDTO";

export interface CommentRepository {
  addComment(input: AddCommentInput): Promise<AddCommentResponse>;
}