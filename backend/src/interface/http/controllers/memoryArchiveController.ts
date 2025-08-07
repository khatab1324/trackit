import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryArchiveUseCase } from "../../../application/useCase/memory/memoryArchiveUseCase";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";

export const archiveMemoryController = async (
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
    const result = await new MemoryArchiveUseCase(
      new MemoryRepositoryImp()
    ).archive({
      user_id: currentUserId,
      memory_id,
    });
    reply.code(200).send({
      message: "Memory archived/unarchived successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while archiving the memory" });
  }
};

export const unarchiveMemoryController = async (
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
    const result = await new MemoryArchiveUseCase(
      new MemoryRepositoryImp()
    ).unarchive({
      user_id: currentUserId,
      memory_id,
    });
    reply.code(200).send({
      message: "Memory unarchived successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while unarchiving the memory" });
  }
};

export const getUserArchivedMemoriesController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new MemoryArchiveUseCase(
      new MemoryRepositoryImp()
    ).getUserArchives(currentUserId);
    reply.code(200).send({
      message: "User archived memories retrieved successfully",
      archives: result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while getting user archived memories" });
  }
};