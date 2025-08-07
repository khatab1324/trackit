import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryReportUseCase } from "../../../application/useCase/memory/memoryReportUseCase";
import { MemoryReportRepositoryImp } from "../../../infrastructure/repositories/memoryReportRepo";

export const memoryReportController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memory_id, reason, report_category } = request.body as {
      memory_id: string;
      reason: string;
      report_category?: string;
    };
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new MemoryReportUseCase(
      new MemoryReportRepositoryImp()
    ).execute({
      user_id: currentUserId,
      memory_id,
      reason,
      report_category,
    });
    reply.code(200).send({
      message: "Memory reported successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while reporting the memory" });
  }
};