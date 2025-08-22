import { FastifyReply, FastifyRequest } from "fastify";
import { UnlikeCommentUseCase } from "../../../application/useCase/comment/unlikeCommentUseCase";
import { CommentRepositoryImp } from "../../../infrastructure/repositories/commentRepo";

export const unlikeCommentController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { comment_id } = request.body as { comment_id: string };
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    if (!comment_id) {
      return reply.code(400).send({ error: "Comment ID is required" });
    }

    const result = await new UnlikeCommentUseCase(
      new CommentRepositoryImp()
    ).execute({
      user_id,
      comment_id,
    });

    reply.code(200).send({
      message: result.message,
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while unliking comment" });
  }
}; 