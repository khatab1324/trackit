import { EditCommentInput, EditCommentResponse } from "../../DTO/commentDTO";
import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class EditCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(input: EditCommentInput): Promise<EditCommentResponse> {
    return this.commentRepository.editComment(input);
  }
} 