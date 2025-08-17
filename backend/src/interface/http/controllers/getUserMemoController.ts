import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetUserMemoriesByIdUseCase } from "../../../application/useCase/memory/getUserMemoriesById";

export async function getUserMemoController(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;
    const currentUserId = (request.user as { id: string }).id;
    
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    if (!userId) {
      return reply.code(400).send({ error: "User ID is required" });
    }

    const userMemories = await new GetUserMemoriesByIdUseCase(
      new MemoryRepositoryImp()
    ).execute(userId, currentUserId);
    
    reply
      .code(200)
      .send({ message: "User memories retrieved successfully", data: userMemories });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while retrieving user memories" });
  }
} 