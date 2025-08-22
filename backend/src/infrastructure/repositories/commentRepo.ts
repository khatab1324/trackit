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
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { db } from "../db/connection";
import { memoryComments } from "../db/schema/memoryCommentsSchema";
import { commentLikes } from "../db/schema/commentLikeSchema";
import { users } from "../db/schema/userSchema";
import { eq, and } from "drizzle-orm";

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

  async getCommentsByMemoryId(memoryId: string, currentUserId?: string): Promise<any[]> {
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
      
      // Get like counts and like status for each comment
      const commentsWithLikes = await Promise.all(
        comments.map(async (comment) => {
          const likeCount = await db
            .select({ count: commentLikes.id })
            .from(commentLikes)
            .where(eq(commentLikes.comment_id, comment.id));
          
          // Check if current user has liked this comment
          let isLiked = false;
          if (currentUserId) {
            const userLike = await db
              .select()
              .from(commentLikes)
              .where(
                and(
                  eq(commentLikes.user_id, currentUserId),
                  eq(commentLikes.comment_id, comment.id)
                )
              )
              .limit(1);
            isLiked = userLike.length > 0;
          }
          
          return {
            ...comment,
            likeCount: likeCount.length,
            isLiked,
          };
        })
      );
      
      return commentsWithLikes;
    } catch (error) {
      console.error("Error getting comments by memory ID:", error);
      throw new Error("Failed to get comments");
    }
  }

  async likeComment(input: LikeCommentInput): Promise<LikeCommentResponse> {
    try {
      // Check if already liked
      const existingLike = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.user_id, input.user_id),
            eq(commentLikes.comment_id, input.comment_id)
          )
        )
        .limit(1);

      if (existingLike.length > 0) {
        return {
          success: false,
          message: "Comment already liked",
          isLiked: true,
        };
      }

      // Add like
      await db.insert(commentLikes).values({
        user_id: input.user_id,
        comment_id: input.comment_id,
      });

      return {
        success: true,
        message: "Comment liked successfully",
        isLiked: true,
      };
    } catch (error) {
      console.error("Error liking comment:", error);
      throw new Error("Failed to like comment");
    }
  }

  async unlikeComment(input: LikeCommentInput): Promise<LikeCommentResponse> {
    try {
      // Remove like
      await db
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.user_id, input.user_id),
            eq(commentLikes.comment_id, input.comment_id)
          )
        );

      return {
        success: true,
        message: "Comment unliked successfully",
        isLiked: false,
      };
    } catch (error) {
      console.error("Error unliking comment:", error);
      throw new Error("Failed to unlike comment");
    }
  }

  async deleteComment(input: DeleteCommentInput): Promise<DeleteCommentResponse> {
    try {
      // First check if user owns the comment
      const comment = await db
        .select()
        .from(memoryComments)
        .where(eq(memoryComments.id, input.comment_id))
        .limit(1);

      if (comment.length === 0) {
        return {
          success: false,
          message: "Comment not found",
        };
      }

      if (comment[0].user_id !== input.user_id) {
        return {
          success: false,
          message: "Unauthorized to delete this comment",
        };
      }

      // Delete the comment (cascade will handle likes)
      await db
        .delete(memoryComments)
        .where(eq(memoryComments.id, input.comment_id));

      return {
        success: true,
        message: "Comment deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  }

  async editComment(input: EditCommentInput): Promise<EditCommentResponse> {
    try {
      // First check if user owns the comment
      const comment = await db
        .select()
        .from(memoryComments)
        .where(eq(memoryComments.id, input.comment_id))
        .limit(1);

      if (comment.length === 0) {
        return {
          success: false,
          message: "Comment not found",
        };
      }

      if (comment[0].user_id !== input.user_id) {
        return {
          success: false,
          message: "Unauthorized to edit this comment",
        };
      }

      // Update the comment
      await db
        .update(memoryComments)
        .set({ comment_text: input.content })
        .where(eq(memoryComments.id, input.comment_id));

      return {
        success: true,
        message: "Comment edited successfully",
        commentId: input.comment_id,
      };
    } catch (error) {
      console.error("Error editing comment:", error);
      throw new Error("Failed to edit comment");
    }
  }

  async isCommentLikedByUser(userId: string, commentId: string): Promise<boolean> {
    try {
      const like = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.user_id, userId),
            eq(commentLikes.comment_id, commentId)
          )
        )
        .limit(1);

      return like.length > 0;
    } catch (error) {
      console.error("Error checking if comment is liked:", error);
      return false;
    }
  }
}