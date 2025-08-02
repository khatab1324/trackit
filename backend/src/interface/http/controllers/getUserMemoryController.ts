import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetCurrentUserMemoriesUseCase } from "../../../application/useCase/memory/getCurrentUserMemories";

export async function getCurrnetUserMemoryController(
  request: any,
  reply: FastifyReply
) {
  try {
    const user_id = request.user?.id;
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const userMemories = await new GetCurrentUserMemoriesUseCase(
      new MemoryRepositoryImp()
    ).execute(user_id);
    reply
      .code(201)
      .send({ message: "User memroy got selected", data: userMemories });
  } catch (error) {
    console.log(error);

    reply
      .code(500)
      .send({ error: "An error occurred while creating the user" });
  }
}
