import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";

export class GetAllMemoriesUseCase {
  constructor(private repo: MemoryRepositoryImp) {}

  async execute(currentUserId: string): Promise<MemoryMemo[]> {
    return this.repo.getAllMemoriesMemo(currentUserId);
  }
}
