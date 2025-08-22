import { LikeCommentInput, LikeCommentResponse } from "../../DTO/commentDTO";
import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class LikeCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: LikeCommentInput): Promise<LikeCommentResponse> {
    return this.commentRepository.likeComment(input);
  }
} 