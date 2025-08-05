import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetCurrentUserMemoriesUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(userId: string): Promise<MemoryMemo[]> {
    return this.memoryRepository.getUserMemoryMemo(userId);
  }
}
