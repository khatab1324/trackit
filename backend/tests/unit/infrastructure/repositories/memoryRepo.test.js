"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const memoryRepo_1 = require("../../../../src/infrastructure/repositories/memoryRepo");
const connection_1 = require("../../../../src/infrastructure/db/connection");
describe("MemoryRepositoryImp - getUserMemoryMemo", () => {
    let memoryRepository;
    let mockDb;
    beforeEach(() => {
        memoryRepository = new memoryRepo_1.MemoryRepositoryImp();
        jest.clearAllMocks();
        mockDb = connection_1.db;
        mockDb.select.mockReturnThis();
        mockDb.from.mockReturnThis();
        mockDb.innerJoin.mockReturnThis();
        mockDb.where.mockReturnThis();
        mockDb.orderBy.mockReturnThis();
    });
    it("should return a list of memory memos for the current user", () => __awaiter(void 0, void 0, void 0, function* () {
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
                is_liked: false,
                is_requested: false,
                userInfo: {
                    user_id: "user123",
                    username: "testuser",
                },
            },
        ];
        mockDb.orderBy.mockResolvedValue(mockMemories);
        const result = yield memoryRepository.getUserMemoryMemo(mockCurrentUserId);
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
            is_liked: expect.anything(),
            is_requested: expect.anything(),
            userInfo: expect.anything(),
        });
        expect(mockDb.from).toHaveBeenCalled();
        expect(mockDb.innerJoin).toHaveBeenCalled();
        expect(mockDb.where).toHaveBeenCalled();
        expect(mockDb.orderBy).toHaveBeenCalled();
        expect(result).toEqual(mockMemories);
    }));
    it("should return an empty array if no memories are found", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCurrentUserId = "user123";
        mockDb.orderBy.mockResolvedValue([]);
        const result = yield memoryRepository.getUserMemoryMemo(mockCurrentUserId);
        expect(result).toEqual([]);
    }));
    it("should throw an error if the database query fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCurrentUserId = "user123";
        mockDb.orderBy.mockRejectedValue(new Error("Database connection failed"));
        yield expect(memoryRepository.getUserMemoryMemo(mockCurrentUserId)).rejects.toThrow("Database connection failed");
    }));
});
