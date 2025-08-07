import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryViewUseCase } from "../../../application/useCase/memory/memoryViewUseCase";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";

export const memoryViewController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memory_id } = request.body as { memory_id: string };
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new MemoryViewUseCase(
      new MemoryRepositoryImp()
    ).execute({
      user_id: currentUserId,
      memory_id,
    });
    reply.code(200).send({
      message: "Memory view processed successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while processing the memory view" });
  }
};