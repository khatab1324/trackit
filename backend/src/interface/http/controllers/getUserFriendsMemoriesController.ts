import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetUserFriendsMemoriesUseCase } from "../../../application/useCase/memory/getUserFriendsMemories";

export const getUserFriendsMemoriesController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const memories = await new GetUserFriendsMemoriesUseCase(
      new MemoryRepositoryImp()
    ).execute(currentUserId);

    return reply.code(200).send({
      message: "Friend's memories retrieved successfully",
      data: memories,
    });
  } catch (error) {
    console.error(error);
    return reply
      .code(500)
      .send({ error: "An error occurred while retrieving friend's memories" });
  }
};
