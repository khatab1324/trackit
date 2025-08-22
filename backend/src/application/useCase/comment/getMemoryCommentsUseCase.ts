import { CommentRepository } from "../../../domain/repositories/commentRepository";

export class GetMemoryCommentsUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(memoryId: string, currentUserId?: string): Promise<any[]> {
    return await this.commentRepository.getCommentsByMemoryId(memoryId, currentUserId);
  }
} 