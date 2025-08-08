jest.mock("../../../../src/infrastructure/db/connection", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  },
}));

import { MemoryRepositoryImp } from "../../../../src/infrastructure/repositories/memoryRepo";
import { db } from "../../../../src/infrastructure/db/connection";

describe("MemoryRepositoryImp - getUserMemoryMemo", () => {
  let memoryRepository: MemoryRepositoryImp;
  let mockDb: any;

  beforeEach(() => {
    memoryRepository = new MemoryRepositoryImp();
    jest.clearAllMocks();

    mockDb = db as any;
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.innerJoin.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
  });

  it("should return a list of memory memos for the current user", async () => {
    const mockCurrentUserId = "user123";
    const mockMemories = [
      {
        id: "memory1",
        count: 1,
        content_url: "https://example.com/image1.jpg",
        content_type: "image",
        lang: 40.7128,
        long: -74.006,
        description: "Memory 1 description",
        num_likes: 10,
        num_comments: 5,
        isFollowed: true,
        is_saved: false,
        userInfo: {
          user_id: "user123",
          username: "testuser",
        },
      },
    ];

    mockDb.orderBy.mockResolvedValue(mockMemories);

    const result = await memoryRepository.getUserMemoryMemo(mockCurrentUserId);

    expect(mockDb.select).toHaveBeenCalledWith({
      id: expect.anything(),
      count: expect.anything(),
      content_url: expect.anything(),
      content_type: expect.anything(),
      lang: expect.anything(),
      long: expect.anything(),
      description: expect.anything(),
      num_likes: expect.anything(),
      num_comments: expect.anything(),
      isFollowed: expect.anything(),
      is_saved: expect.anything(),
      userInfo: expect.anything(),
    });

    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.innerJoin).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();

    expect(result).toEqual(mockMemories);
  });

  it("should return an empty array if no memories are found", async () => {
    const mockCurrentUserId = "user123";

    mockDb.orderBy.mockResolvedValue([]);

    const result = await memoryRepository.getUserMemoryMemo(mockCurrentUserId);

    expect(result).toEqual([]);
  });

  it("should throw an error if the database query fails", async () => {
    const mockCurrentUserId = "user123";

    mockDb.orderBy.mockRejectedValue(new Error("Database connection failed"));

    await expect(
      memoryRepository.getUserMemoryMemo(mockCurrentUserId)
    ).rejects.toThrow("Database connection failed");
  });
});
