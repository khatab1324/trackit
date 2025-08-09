import { and, between, eq, notInArray, sql } from "drizzle-orm";
import { MemoryInput } from "../../application/DTO/memoryInputDTO";
import { Memory } from "../../domain/entities/memory";
import { MemoryRepository } from "../../domain/repositories/memoryRepository";
import { db } from "../db/connection";
import { memories } from "../db/schema/memorySchema";
import { MemoryMemo } from "../../domain/valueObjects/MemoryMemo";
import { users } from "../db/schema/userSchema";
import { commentLikes } from "../db/schema/commentLikeSchema";
import { memoryLikes } from "../db/schema/memoryLikesSchema";
import { log } from "console";
import id from "zod/v4/locales/id.cjs";
import { viewCounts } from "../db/schema/viewCountSchema";
import {
  MemoryViewInput,
  MemoryViewResponse,
} from "../../application/DTO/memoryViewDTO";
import { archivedMemories } from "../db/schema/archiveMemory";
import {
  MemoryArchiveInput,
  MemoryArchiveResponse,
} from "../../application/DTO/memoryArchiveDTO";
import { ArchivedMemory } from "../../application/DTO/memoryArchiveDTO";

export class MemoryRepositoryImp implements MemoryRepository {
  async addMemoryToDB(memory: MemoryInput): Promise<Memory> {
    const [createdMemory] = await db
      .insert(memories)
      .values({
        ...memory,
        latitude: parseFloat(memory.latitude),
        longitude: parseFloat(memory.longitude),
      })
      .returning();
    return createdMemory;
  }
  async getUserMemoryFromDB(id: string) {
    const memoriesFromDB = await db
      .select()
      .from(memories)
      .where(eq(memories.user_id, id));
    return memoriesFromDB;
  }
  async getMemoryById(memoryId: string): Promise<Memory> {
    const memoryFromDB = await db
      .select()
      .from(memories)
      .where(eq(memories.id, memoryId));
    return memoryFromDB[0];
  }
  getUserMemoryIds(
    userId: string
  ): Promise<{ id: string; content_url: string }[]> {
    log("Retrieving User Memory IDs for User ID:", userId);
    return db
      .select({
        id: memories.id,
        content_url: memories.content_url,
      })
      .from(memories)
      .where(eq(memories.user_id, userId));
  }
  async getMemoryMemoById(
    currentUserId: string,
    memoryId: string
  ): Promise<MemoryMemo> {
    log("Retrieving Memory Memo for ID:", memoryId);
    log("Current User ID:", currentUserId);
    if (!memoryId) {
      throw new Error("Memory ID is required");
    }
    const memoryFromDB = await db
      .select({
        id: memories.id,
        content_url: memories.content_url,
        content_type: memories.content_type,
        lang: memories.latitude,
        long: memories.longitude,
        description: memories.description,
        num_likes:
          sql<number>`(SELECT COUNT(*) FROM memory_likes WHERE memory_likes.memory_id = ${memories.id})`.as(
            "num_likes"
          ),
        num_comments: sql<number>`(
        SELECT COUNT(*) FROM memory_comments WHERE memory_comments.memory_id = ${memories.id}
      )`.as("num_comments"),
        isFollowed: sql<boolean>`EXISTS(
        SELECT 1 FROM follows 
        WHERE follows.follower_id = ${currentUserId}
        AND follows.followed_id = ${memories.user_id}
      )`.as("isFollowed"),
        is_saved: sql<boolean>`EXISTS(
        SELECT 1 FROM bookmarks
        WHERE bookmarks.memory_id = ${memories.id}
        AND bookmarks.user_id = ${currentUserId}
      )`.as("is_saved"),
        is_liked: sql<boolean>`EXISTS(
        SELECT 1 FROM memory_likes
        WHERE memory_likes.memory_id = ${memories.id}
        AND memory_likes.user_id = ${currentUserId}
      )`.as("is_liked"),
        userInfo: {
          user_id: users.id,
          username: users.username,
        },
      })
      .from(memories)
      .innerJoin(users, eq(users.id, memories.user_id))
      .where(eq(memories.id, memoryId))
      .limit(1);
    log("Memory Memo Retrieved:", memoryFromDB[0]);

    return memoryFromDB[0] as MemoryMemo;
  }

  async getUserMemoryMemo(currentUserId: string): Promise<MemoryMemo[]> {
    let count = 1;
    const memoriesFromDB = await db
      .select({
        id: memories.id,
        count: sql<number>`(${count++})`.as("counter"),
        content_url: memories.content_url,
        content_type: memories.content_type,
        lang: memories.latitude,
        long: memories.longitude,
        description: memories.description,
        num_likes:
          sql<number>`(SELECT COUNT(*) FROM memory_likes WHERE memory_likes.memory_id = ${memories.id})`.as(
            "num_likes"
          ),
        num_comments: sql<number>`(
      SELECT COUNT(*) FROM memory_comments WHERE memory_comments.memory_id = ${memories.id}
      )`.as("num_comments"),
        isFollowed: sql<boolean>`EXISTS(
      SELECT 1 FROM follows 
      WHERE follows.follower_id = ${currentUserId}
      AND follows.followed_id = ${memories.user_id}
      )`.as("isFollowed"),
        is_saved: sql<boolean>`EXISTS(
      SELECT 1 FROM bookmarks
      WHERE bookmarks.memory_id = ${memories.id}
      AND bookmarks.user_id = ${currentUserId}
      )`.as("is_saved"),
        is_liked: sql<boolean>`EXISTS(
      SELECT 1 FROM memory_likes
      WHERE memory_likes.memory_id = ${memories.id}
      AND memory_likes.user_id = ${currentUserId}
      )`.as("is_liked"),
        userInfo: {
          user_id: users.id,
          username: users.username,
        },
      })
      .from(memories)
      .innerJoin(users, eq(users.id, memories.user_id))
      .where(eq(memories.user_id, currentUserId))
      .orderBy(memories.created_at);

    return memoriesFromDB as MemoryMemo[];
  }
  async getNearbyMemoriesMemo(
    currentUserId: string,
    location: { lang: string; long: string },
    excludeIds: string[]
  ): Promise<MemoryMemo[]> {
    const OFFSET = 0.002;
    const lat = parseFloat(location.lang);
    const long = parseFloat(location.long);

    const minLat = lat - OFFSET;
    const maxLat = lat + OFFSET;
    const minLong = long - OFFSET;
    const maxLong = long + OFFSET;
    let count = 1;
    log("Retrieving nearby memories for user:", currentUserId);
    log("Location:", location);
    log("Excluding IDs:", excludeIds);
    log("Latitude Range:", minLat, "to", maxLat);
    log("Longitude Range:", minLong, "to", maxLong);
    const nearMemoriesFromDB = await db
      .select({
        id: memories.id,
        count: sql<number>`(${count++})`.as("counter"),
        content_url: memories.content_url,
        content_type: memories.content_type,
        lang: memories.latitude,
        long: memories.longitude,
        description: memories.description,
        num_likes:
          sql<number>`(SELECT COUNT(*) FROM memory_likes WHERE memory_likes.memory_id = ${memories.id})`.as(
            "num_likes"
          ),
        num_comments: sql<number>`(
        SELECT COUNT(*) FROM memory_comments WHERE memory_comments.memory_id = ${memories.id}
      )`.as("num_comments"),
        isFollowed: sql<boolean>`EXISTS(
        SELECT 1 FROM follows 
        WHERE follows.follower_id = ${currentUserId}
        AND follows.followed_id = ${memories.user_id}
      )`.as("isFollowed"),
        is_saved: sql<boolean>`EXISTS(
        SELECT 1 FROM bookmarks
        WHERE bookmarks.memory_id = ${memories.id}
        AND bookmarks.user_id = ${currentUserId}
      )`.as("is_saved"),
        is_liked: sql<boolean>`EXISTS(
        SELECT 1 FROM memory_likes
        WHERE memory_likes.memory_id = ${memories.id}
        AND memory_likes.user_id = ${currentUserId}
      )`.as("is_liked"),
        userInfo: {
          user_id: users.id,
          username: users.username,
        },
      })
      .from(memories)
      .innerJoin(users, eq(users.id, memories.user_id))
      .where(
        and(
          between(memories.latitude, minLat, maxLat),
          between(memories.longitude, minLong, maxLong),
          // excludeIds.length > 0
          //   ? notInArray(memories.id, excludeIds)
          //   : undefined,
          // eq(memories.isPublic, true),
          notInArray(memories.user_id, [currentUserId])
        )
      );
    console.log("Nearby Memories Retrieved:", nearMemoriesFromDB);
    return nearMemoriesFromDB;
  }

  async recordMemoryView(input: MemoryViewInput): Promise<MemoryViewResponse> {
    try {
      // this for check if the user already viewed this memory
      const existingView = await db
        .select()
        .from(viewCounts)
        .where(
          and(
            eq(viewCounts.user_id, input.user_id),
            eq(viewCounts.memory_id, input.memory_id)
          )
        )
        .limit(1);

      if (existingView.length === 0) {
        await db.insert(viewCounts).values({
          user_id: input.user_id,
          memory_id: input.memory_id,
        });
      }

      const result = await db
        .select({ count: sql<number>`COUNT(*)`.as("count") })
        .from(viewCounts)
        .where(eq(viewCounts.memory_id, input.memory_id));

      return {
        success: true,
        message: "Memory view recorded successfully",
        viewCount: result[0]?.count || 0,
      };
    } catch (error) {
      console.error("Error recording memory view:", error);
      throw new Error("Failed to record memory view");
    }
  }

  async archiveMemory(
    input: MemoryArchiveInput
  ): Promise<MemoryArchiveResponse> {
    try {
      // this for check if the memory already archived
      const existing = await db
        .select()
        .from(archivedMemories)
        .where(
          and(
            eq(archivedMemories.user_id, input.user_id),
            eq(archivedMemories.id, input.memory_id)
          )
        )
        .limit(1);
      if (existing.length > 0) {
        return {
          success: false,
          message: "Memory already archived",
          isArchived: true,
        };
      }
      await db.insert(archivedMemories).values({
        id: input.memory_id,
        user_id: input.user_id,
        archived_date: new Date(),
      });
      return {
        success: true,
        message: "Memory archived successfully",
        isArchived: true,
      };
    } catch (error) {
      console.error("Error archiving memory:", error);
      throw new Error("Failed to archive memory");
    }
  }

  async unarchiveMemory(
    input: MemoryArchiveInput
  ): Promise<MemoryArchiveResponse> {
    try {
      const deleted = await db
        .delete(archivedMemories)
        .where(
          and(
            eq(archivedMemories.user_id, input.user_id),
            eq(archivedMemories.id, input.memory_id)
          )
        );
      return {
        success: true,
        message: "Memory unarchived successfully",
        isArchived: false,
      };
    } catch (error) {
      console.error("Error unarchiving memory:", error);
      throw new Error("Failed to unarchive memory");
    }
  }

  async getUserArchivedMemories(user_id: string): Promise<ArchivedMemory[]> {
    try {
      const result = await db
        .select({
          id: archivedMemories.id,
          user_id: archivedMemories.user_id,
          memory_id: archivedMemories.id,
          archived_date: archivedMemories.archived_date,
          memory: {
            id: memories.id,
            content_url: memories.content_url,
            content_type: memories.content_type,
            description: memories.description,
            created_at: memories.created_at,
          },
        })
        .from(archivedMemories)
        .innerJoin(memories, eq(archivedMemories.id, memories.id))
        .where(eq(archivedMemories.user_id, user_id));
      return result as ArchivedMemory[];
    } catch (error) {
      console.error("Error getting archived memories:", error);
      throw new Error("Failed to get archived memories");
    }
  }

  async getAllMemoriesMemo(currentUserId: string): Promise<MemoryMemo[]> {
    let count = 1;
    const memoriesFromDB = await db
      .select({
        id: memories.id,
        count: sql<number>`(${count++})`.as("counter"),
        content_url: memories.content_url,
        content_type: memories.content_type,
        lang: memories.latitude,
        long: memories.longitude,
        description: memories.description,
        num_likes: sql<number>`(
          SELECT COUNT(*) FROM memory_likes WHERE memory_likes.memory_id = ${memories.id}
        )`.as("num_likes"),
        num_comments: sql<number>`(
          SELECT COUNT(*) FROM memory_comments WHERE memory_comments.memory_id = ${memories.id}
        )`.as("num_comments"),
        isFollowed: sql<boolean>`EXISTS(
          SELECT 1 FROM follows 
          WHERE follows.follower_id = ${currentUserId}
          AND follows.followed_id = ${memories.user_id}
        )`.as("isFollowed"),
        is_saved: sql<boolean>`EXISTS(
          SELECT 1 FROM bookmarks
          WHERE bookmarks.memory_id = ${memories.id}
          AND bookmarks.user_id = ${currentUserId}
        )`.as("is_saved"),
        is_liked: sql<boolean>`EXISTS(
          SELECT 1 FROM memory_likes
          WHERE memory_likes.memory_id = ${memories.id}
          AND memory_likes.user_id = ${currentUserId}
        )`.as("is_liked"),
        userInfo: {
          user_id: users.id,
          username: users.username,
        },
      })
      .from(memories)
      .innerJoin(users, eq(users.id, memories.user_id))
      .orderBy(memories.created_at);

    return memoriesFromDB as unknown as MemoryMemo[];
  }
}
