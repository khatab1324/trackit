import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetUserMemoriesByIdUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(
    targetUserId: string,
    currentUserId: string
  ): Promise<MemoryMemo[]> {
    return this.memoryRepository.getUserMemoriesById(targetUserId, currentUserId);
  }
} 