import { AddCommentInput, AddCommentResponse } from "../../application/DTO/commentDTO";
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { db } from "../db/connection";
import { memoryComments } from "../db/schema/memoryCommentsSchema";

export class CommentRepositoryImp implements CommentRepository {
  async addComment(input: AddCommentInput): Promise<AddCommentResponse> {
    try {
      const [comment] = await db
        .insert(memoryComments)
        .values({
          id: crypto.randomUUID(),
          user_id: input.user_id,
          memory_id: input.memory_id,
          comment_text: input.content,
        })
        .returning({ id: memoryComments.id });
      return {
        success: true,
        message: "Comment added successfully",
        commentId: comment.id,
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new Error("Failed to add comment");
    }
  }
}