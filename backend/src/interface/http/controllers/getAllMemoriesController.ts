import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetAllMemoriesUseCase } from "../../../application/useCase/memory/getAllMemories";

export const getAllMemoriesController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const currentUserId = (request.user as any)?.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const memories = await new GetAllMemoriesUseCase(
      new MemoryRepositoryImp()
    ).execute(currentUserId);

    return reply.code(200).send({
      message: "Memories retrieved successfully",
      data: memories,
    });
  } catch (error) {
    console.error(error);
    return reply
      .code(500)
      .send({ error: "An error occurred while retrieving memories" });
  }
};
