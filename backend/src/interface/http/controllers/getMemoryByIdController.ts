import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetMemroyByIdUseCase } from "../../../application/useCase/memory/getMemoryByIdUseCase";
import { log } from "console";

export const getMemroyByIdController = async (
  request: FastifyRequest<{ Params: { memoryId: string } }>,
  reply: FastifyReply
) => {
  try {
    const memoryId = request.params.memoryId as string;
    //TODO fix the type of request.user
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;

    const memoryMemo = await new GetMemroyByIdUseCase(
      new MemoryRepositoryImp()
    ).execute(currentUserId, memoryId);
    console.log(memoryMemo);

    reply.code(200).send({
      message: "Memory retrieved successfully",
      data: memoryMemo,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while retrieving the memory" });
  }
};
