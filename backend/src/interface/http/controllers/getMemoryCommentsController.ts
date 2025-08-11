import { FastifyReply, FastifyRequest } from "fastify";
import { GetMemoryCommentsUseCase } from "../../../application/useCase/comment/getMemoryCommentsUseCase";
import { CommentRepositoryImp } from "../../../infrastructure/repositories/commentRepo";

export const getMemoryCommentsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memoryId } = request.params as { memoryId: string };
    
    if (!memoryId) {
      return reply.code(400).send({ error: "Memory ID is required" });
    }

    const comments = await new GetMemoryCommentsUseCase(
      new CommentRepositoryImp()
    ).execute(memoryId);

    reply.code(200).send({
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error getting memory comments:", error);
    reply
      .code(500)
      .send({ error: "An error occurred while getting comments" });
  }
}; 