import { and, eq, sql } from "drizzle-orm";
import { MemoryLikeInput, MemoryLikeResponse } from "../../application/DTO/memoryLikeDTO";
import { LikeRepository } from "../../domain/repositories/likeRepository";
import { db } from "../db/connection";
import { memoryLikes } from "../db/schema/memoryLikesSchema";

export class LikeRepositoryImp implements LikeRepository {
  async toggleMemoryLike(input: MemoryLikeInput): Promise<MemoryLikeResponse> {
    try {
      const existingLike = await db
        .select()
        .from(memoryLikes)
        .where(
          and(
            eq(memoryLikes.user_id, input.user_id),
            eq(memoryLikes.memory_id, input.memory_id)
          )
        )
        .limit(1);

      if (existingLike.length > 0) {
        await db
          .delete(memoryLikes)
          .where(
            and(
              eq(memoryLikes.user_id, input.user_id),
              eq(memoryLikes.memory_id, input.memory_id)
            )
          );

        return {
          success: true,
          message: "Memory unliked successfully",
          isLiked: false,
        };
      } else {
        await db.insert(memoryLikes).values({
          id: crypto.randomUUID(),
          user_id: input.user_id,
          memory_id: input.memory_id,
        });

        return {
          success: true,
          message: "Memory liked successfully",
          isLiked: true,
        };
      }
    } catch (error) {
      console.error("Error toggling memory like:", error);
      throw new Error("Failed to toggle memory like");
    }
  }
//TODO : think about are we need to check if user like memory or not because we have is_liked in memory memo and toggleMemoryLike function
  async isMemoryLikedByUser(userId: string, memoryId: string): Promise<boolean> {
    try {
      const existingLike = await db
        .select()
        .from(memoryLikes)
        .where(
          and(
            eq(memoryLikes.user_id, userId),
            eq(memoryLikes.memory_id, memoryId)
          )
        )
        .limit(1);

      return existingLike.length > 0;
    } catch (error) {
      console.error("Error checking if memory is liked:", error);
      return false;
    }
  }

  async getMemoryLikeCount(memoryId: string): Promise<number> {
    try {
      const result = await db
        .select({
          count: sql<number>`COUNT(*)`.as("count"),
        })
        .from(memoryLikes)
        .where(eq(memoryLikes.memory_id, memoryId));

      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error getting memory like count:", error);
      return 0;
    }
  }
} 