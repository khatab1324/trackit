import { FastifyReply, FastifyRequest } from "fastify";
import { EditCommentUseCase } from "../../../application/useCase/comment/editCommentUseCase";
import { CommentRepositoryImp } from "../../../infrastructure/repositories/commentRepo";

export const editCommentController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { comment_id, content } = request.body as { comment_id: string; content: string };
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    if (!comment_id) {
      return reply.code(400).send({ error: "Comment ID is required" });
    }

    if (!content || content.trim().length === 0) {
      return reply.code(400).send({ error: "Comment content is required" });
    }

    const result = await new EditCommentUseCase(
      new CommentRepositoryImp()
    ).execute({
      user_id,
      comment_id,
      content: content.trim(),
    });

    reply.code(200).send({
      message: result.message,
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while editing comment" });
  }
}; 