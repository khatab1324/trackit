import { LikeCommentInput, LikeCommentResponse } from "../../DTO/commentDTO";
import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class UnlikeCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: LikeCommentInput): Promise<LikeCommentResponse> {
    return this.commentRepository.unlikeComment(input);
  }
} 