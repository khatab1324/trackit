import { MemoryArchiveInput } from "../../DTO/memoryArchiveDTO";
import { MemoryRepository } from "../../../domain/repositories/memoryRepository";

export class MemoryArchiveUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async archive(input: MemoryArchiveInput) {
    return this.memoryRepository.archiveMemory(input);
  }

  async unarchive(input: MemoryArchiveInput) {
    return this.memoryRepository.unarchiveMemory(input);
  }

  async getUserArchives(user_id: string) {
    return this.memoryRepository.getUserArchivedMemories(user_id);
  }
}