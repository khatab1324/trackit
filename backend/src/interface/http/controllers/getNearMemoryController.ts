import { FastifyReply, FastifyRequest } from "fastify";
import ca from "zod/v4/locales/ca.cjs";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { GetMemroyByIdUseCase } from "../../../application/useCase/memory/getMemoryByIdUseCase";
import { GetNearMemoryUseCase } from "../../../application/useCase/memory/GetNearMemoryUseCase";

export const GetNearMemoryController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;

    const requestBody = request.body as {
      location: { lang: string; long: string };
    };
    if (!requestBody) {
      return reply.code(400).send({ error: "Location is required" });
    }
    const location = requestBody.location;
    const memories = await new GetNearMemoryUseCase(
      new MemoryRepositoryImp()
    ).execute(currentUserId, location);

    return reply.code(200).send({
      message: "Nearby memories retrieved successfully",
      data: memories,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "An error occurred while retrieving nearby memories",
    });
  }
};
