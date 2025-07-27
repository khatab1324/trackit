import { MemoryInput } from "../../application/DTO/memoryInputDTO";
import { Memory } from "../../domain/entities/memory";
import { MemoryRepository } from "../../domain/repositories/memoryRepository";
import { db } from "../db/connection";
import { memories } from "../db/schema/memorySchema";

export class MemoryRepositoryImp implements MemoryRepository {
  async addMemoryToDB(memory: MemoryInput): Promise<Memory> {
    const [createdMemory] = await db
      .insert(memories)
      .values({
        ...memory,
        latitude: parseFloat(memory.latitude),
        longitude: parseFloat(memory.longitude),
      })
      .returning();
    return createdMemory;
  }
}
