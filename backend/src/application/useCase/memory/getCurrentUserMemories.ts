import { Memory } from "../../../domain/entities/memory";
import { MemoryRepository } from "../../../domain/repositories/memoryRepository";

export class GetCurrentUserMemoriesUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(id: string): Promise<Memory[]> {
    return this.memoryRepository.getUserMemoryFromDB(id);
  }
}
