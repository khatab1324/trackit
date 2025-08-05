export interface RedisRepository {
  getSentMemoryIds(userId: string): Promise<string[]>;
  saveSentMemoryIds(userId: string, ids: string[]): Promise<void>;
}
