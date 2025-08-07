import { FastifyReply, FastifyRequest } from "fastify";
import { AddCommentUseCase } from "../../../application/useCase/comment/addCommentUseCase";
import { CommentRepositoryImp } from "../../../infrastructure/repositories/commentRepo";

export const addCommentController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memory_id, content } = request.body as { memory_id: string; content: string };
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new AddCommentUseCase(
      new CommentRepositoryImp()
    ).execute({
      user_id,
      memory_id,
      content,
    });
    reply.code(200).send({
      message: "Comment added successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while adding comment" });
  }
};