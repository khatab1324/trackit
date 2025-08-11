import { AddCommentInput, AddCommentResponse } from "../../application/DTO/commentDTO";
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { db } from "../db/connection";
import { memoryComments } from "../db/schema/memoryCommentsSchema";
import { users } from "../db/schema/userSchema";
import { eq } from "drizzle-orm";

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

  async getCommentsByMemoryId(memoryId: string): Promise<any[]> {
    try {
      const comments = await db
        .select({
          id: memoryComments.id,
          content: memoryComments.comment_text,
          memoryId: memoryComments.memory_id,
          userId: memoryComments.user_id,
          created_at: memoryComments.create_at,
          updated_at: memoryComments.create_at, // Using create_at as updated_at since it's not in schema
          username: users.username,
        })
        .from(memoryComments)
        .leftJoin(users, eq(memoryComments.user_id, users.id))
        .where(eq(memoryComments.memory_id, memoryId))
        .orderBy(memoryComments.create_at);
      
      return comments;
    } catch (error) {
      console.error("Error getting comments by memory ID:", error);
      throw new Error("Failed to get comments");
    }
  }
}