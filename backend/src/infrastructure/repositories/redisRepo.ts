import { RedisRepository } from "../../domain/repositories/redisRepositories";
import { redis } from "../db/redis";

export class RedisMemoryRepository implements RedisRepository {
  async getSentMemoryIds(userId: string): Promise<string[]> {
    const cacheKey = `seenMemories:${userId}`;
    const cached = await redis.smembers(cacheKey);
    console.log("cached", cached);

    return cached.map((id) => JSON.parse(id));
  }

  async saveSentMemoryIds(userId: string, ids: string[]): Promise<void> {
    const cacheKey = `seenMemories:${userId}`;
    await redis.sadd(cacheKey, JSON.stringify(ids));
  }
}
