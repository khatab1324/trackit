import { MemoryLikeInput, MemoryLikeResponse } from "../../application/DTO/memoryLikeDTO";

export interface LikeRepository {
  toggleMemoryLike(input: MemoryLikeInput): Promise<MemoryLikeResponse>;
  isMemoryLikedByUser(userId: string, memoryId: string): Promise<boolean>;
  getMemoryLikeCount(memoryId: string): Promise<number>;
} 