import { LikeRepository } from "../../../domain/repositories/likeRepository";
import { MemoryLikeInput, MemoryLikeResponse } from "../../DTO/memoryLikeDTO";

export class MemoryLikeUseCase {
  constructor(private likeRepository: LikeRepository) {}

  async execute(input: MemoryLikeInput): Promise<MemoryLikeResponse> {
    return this.likeRepository.toggleMemoryLike(input);
  }
} 