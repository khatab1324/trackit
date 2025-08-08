import { and, eq } from "drizzle-orm";
import {
  BookmarkInput,
  BookmarkResponse,
  BookmarkedMemory,
} from "../../application/DTO/memorySaveDTO";
import { BookmarkRepository } from "../../domain/repositories/bookmarkRepository";
import { db } from "../db/connection";
import { bookmarks } from "../db/schema/bookmarkSchema";
import { memories } from "../db/schema/memorySchema";
import { users } from "../db/schema/userSchema";

export class BookmarkRepositoryImp implements BookmarkRepository {
  async toggleBookmark(input: BookmarkInput): Promise<BookmarkResponse> {
    try {
      const existingBookmark = await db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.user_id, input.user_id),
            eq(bookmarks.memory_id, input.memory_id)
          )
        )
        .limit(1);

      if (existingBookmark.length > 0) {
        await db
          .delete(bookmarks)
          .where(
            and(
              eq(bookmarks.user_id, input.user_id),
              eq(bookmarks.memory_id, input.memory_id)
            )
          );

        return {
          success: true,
          message: "Memory removed from bookmarks successfully",
          isBookmarked: false,
        };
      } else {
        await db.insert(bookmarks).values({
          user_id: input.user_id,
          memory_id: input.memory_id,
        });

        return {
          success: true,
          message: "Memory bookmarked successfully",
          isBookmarked: true,
        };
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw new Error("Failed to toggle bookmark");
    }
  }

  async getUserBookmarks(userId: string): Promise<BookmarkedMemory[]> {
    try {
      const bookmarkedMemories = await db
        .select({
          id: bookmarks.id,
          memory_id: bookmarks.memory_id,
          saved_at: bookmarks.saved_at,
          memory: {
            id: memories.id,
            content_url: memories.content_url,
          },
        })
        .from(bookmarks)
        .innerJoin(memories, eq(bookmarks.memory_id, memories.id))
        .innerJoin(users, eq(memories.user_id, users.id))
        .where(eq(bookmarks.user_id, userId))
        .orderBy(bookmarks.saved_at);

      return bookmarkedMemories as BookmarkedMemory[];
    } catch (error) {
      console.error("Error getting user bookmarks:", error);
      throw new Error("Failed to get user bookmarks");
    }
  }
  //TODO: remove this method if not needed
  async isMemoryBookmarkedByUser(
    userId: string,
    memoryId: string
  ): Promise<boolean> {
    try {
      const existingBookmark = await db
        .select()
        .from(bookmarks)
        .where(
          and(eq(bookmarks.user_id, userId), eq(bookmarks.memory_id, memoryId))
        )
        .limit(1);

      return existingBookmark.length > 0;
    } catch (error) {
      console.error("Error checking if memory is bookmarked:", error);
      return false;
    }
  }
}
