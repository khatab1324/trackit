import { Memory } from "../../../domain/entities/memory";
import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetMemroyByIdUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(currentUserId: string, memoryId: string): Promise<MemoryMemo> {
    return this.memoryRepository.getMemoryMemoById(currentUserId, memoryId);
  }
}
