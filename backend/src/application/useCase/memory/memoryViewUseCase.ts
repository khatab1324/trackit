import { MemoryViewInput, MemoryViewResponse } from "../../DTO/memoryViewDTO";
import { MemoryRepository } from "../../../domain/repositories/memoryRepository";

export class MemoryViewUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(input: MemoryViewInput): Promise<MemoryViewResponse> {
    return this.memoryRepository.recordMemoryView(input);
  }
}