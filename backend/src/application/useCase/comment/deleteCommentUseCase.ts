import { DeleteCommentInput, DeleteCommentResponse } from "../../DTO/commentDTO";
import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class DeleteCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: DeleteCommentInput): Promise<DeleteCommentResponse> {
    return this.commentRepository.deleteComment(input);
  }
} 