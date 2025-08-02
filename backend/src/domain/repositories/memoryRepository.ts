import { MemoryInput } from "../../application/DTO/memoryInputDTO";
import { Memory } from "../entities/memory";

export interface MemoryRepository {
  addMemoryToDB(memory: MemoryInput): Promise<Memory>;
  getUserMemoryFromDB(id: string): Promise<Memory[]>;
}
