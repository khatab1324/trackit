import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetCurrentUserMemoriesUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(
    userId: string
  ): Promise<{ id: string; content_url: string }[]> {
    return this.memoryRepository.getUserMemoryIds(userId);
  }
}
