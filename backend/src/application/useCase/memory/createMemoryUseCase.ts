import { Memory } from "../../../domain/entities/memory";
import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryInput } from "../../DTO/memoryInputDTO";

export class CreateMemoryUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(input: MemoryInput): Promise<Memory> {
    return this.memoryRepository.addMemoryToDB(input);
  }
}
