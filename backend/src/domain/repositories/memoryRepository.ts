import { MemoryInput } from "../../application/DTO/memoryInputDTO";
import { Memory } from "../entities/memory";
import { MemoryMemo } from "../valueObjects/MemoryMemo";

export interface MemoryRepository {
  addMemoryToDB(memory: MemoryInput): Promise<Memory>;
  getMemoryMemoById(
    currentUserId: string,
    memoryId: string
  ): Promise<MemoryMemo>;
  getUserMemoryMemo(currentUserId: string): Promise<MemoryMemo[]>;
  getNearbyMemoriesMemo(
    currentUserId: string,
    location: { lang: string; long: string },
    excludeIds: string[]
  ): Promise<MemoryMemo[]>;
}
