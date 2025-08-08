import { AddCommentInput } from "../../DTO/commentDTO";
import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class AddCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: AddCommentInput) {
    return this.commentRepository.addComment(input);
  }
}