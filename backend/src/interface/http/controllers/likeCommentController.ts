import { FastifyReply, FastifyRequest } from "fastify";
import { LikeCommentUseCase } from "../../../application/useCase/comment/likeCommentUseCase";
import { CommentRepositoryImp } from "../../../infrastructure/repositories/commentRepo";

export const likeCommentController = async (
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

    const result = await new LikeCommentUseCase(
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
      .send({ error: "An error occurred while liking comment" });
  }
}; 