import { BookmarkInput, BookmarkResponse, BookmarkedMemory } from "../../application/DTO/memorySaveDTO";

export interface BookmarkRepository {
  toggleBookmark(input: BookmarkInput): Promise<BookmarkResponse>;
  getUserBookmarks(userId: string): Promise<BookmarkedMemory[]>;
  isMemoryBookmarkedByUser(userId: string, memoryId: string): Promise<boolean>;
} 