import { MemoryInput } from "../../application/DTO/memoryInputDTO";
import { Memory } from "../entities/memory";
import { MemoryMemo } from "../valueObjects/MemoryMemo";
import {
  MemoryViewInput,
  MemoryViewResponse,
} from "../../application/DTO/memoryViewDTO";
import {
  MemoryArchiveInput,
  MemoryArchiveResponse,
  ArchivedMemory,
} from "../../application/DTO/memoryArchiveDTO";

export interface MemoryRepository {
  addMemoryToDB(memory: MemoryInput): Promise<Memory>;
  getMemoryMemoById(
    currentUserId: string,
    memoryId: string
  ): Promise<MemoryMemo>;
  getUserMemoryMemo(currentUserId: string): Promise<MemoryMemo[]>;
  getUserMemoryIds(
    userId: string
  ): Promise<{ id: string; content_url: string }[]>;
  getNearbyMemoriesMemo(
    currentUserId: string,
    location: { lang: string; long: string },
    excludeIds: string[]
  ): Promise<MemoryMemo[]>;
  recordMemoryView(input: MemoryViewInput): Promise<MemoryViewResponse>;
  archiveMemory(input: MemoryArchiveInput): Promise<MemoryArchiveResponse>;
  unarchiveMemory(input: MemoryArchiveInput): Promise<MemoryArchiveResponse>;
  getUserArchivedMemories(user_id: string): Promise<ArchivedMemory[]>;
  getAllMemoriesMemo(currentUserId: string): Promise<MemoryMemo[]>;
  getUserFriendsMemoriesMemo(currentUserId: string): Promise<MemoryMemo[]>;
}
