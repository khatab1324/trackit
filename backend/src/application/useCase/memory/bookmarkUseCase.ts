import { BookmarkRepository } from "../../../domain/repositories/bookmarkRepository";
import { BookmarkInput, BookmarkResponse } from "../../DTO/memorySaveDTO";

export class BookmarkUseCase {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  async toggleBookmark(input: BookmarkInput): Promise<BookmarkResponse> {
    return this.bookmarkRepository.toggleBookmark(input);
  }

  async getUserBookmarks(userId: string) {
    return this.bookmarkRepository.getUserBookmarks(userId);
  }
} 