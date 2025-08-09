import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetUserFriendsMemoriesUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(currentUserId: string): Promise<MemoryMemo[]> {
    return this.memoryRepository.getUserFriendsMemoriesMemo(currentUserId);
  }
}
