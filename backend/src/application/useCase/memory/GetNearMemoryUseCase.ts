import { MemoryRepository } from "../../../domain/repositories/memoryRepository";
import { MemoryMemo } from "../../../domain/valueObjects/MemoryMemo";
import { redis } from "../../../infrastructure/db/redis";
import { RedisMemoryRepository } from "../../../infrastructure/repositories/redisRepo";

export class GetNearMemoryUseCase {
  constructor(private memoryRepository: MemoryRepository) {}

  async execute(
    currentUserId: string,
    location: { lang: string; long: string }
  ): Promise<MemoryMemo[]> {
    const RedisRepo = new RedisMemoryRepository();
    
    const sentMemoryIds = await RedisRepo.getSentMemoryIds(currentUserId);
    const nearbyMemories = await this.memoryRepository.getNearbyMemoriesMemo(
      currentUserId,
      location,
      sentMemoryIds
    );
    const newIds = nearbyMemories.map((m) => m.id);
    if (newIds.length > 0) {
      await RedisRepo.saveSentMemoryIds(currentUserId, newIds);
    }
    return nearbyMemories;
  }
}
