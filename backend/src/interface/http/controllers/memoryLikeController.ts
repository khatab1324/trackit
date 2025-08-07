import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryLikeInput } from "../../../application/DTO/memoryLikeDTO";
import { MemoryLikeUseCase } from "../../../application/useCase/memory/memoryLikeUseCase";
import { LikeRepositoryImp } from "../../../infrastructure/repositories/likeRepo";

export const memoryLikeController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memory_id } = request.body as MemoryLikeInput;

    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    
    const result = await new MemoryLikeUseCase(new LikeRepositoryImp()).execute(
      { memory_id, user_id: currentUserId }
    );

    reply.code(200).send({
      message: "Memory like processed successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while processing the memory like" });
  }
};
