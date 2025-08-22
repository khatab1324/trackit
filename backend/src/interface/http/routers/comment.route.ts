import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { addCommentController } from "../controllers/commentController";
import { getMemoryCommentsController } from "../controllers/getMemoryCommentsController";
import { likeCommentController } from "../controllers/likeCommentController";
import { unlikeCommentController } from "../controllers/unlikeCommentController";
import { deleteCommentController } from "../controllers/deleteCommentController";
import { editCommentController } from "../controllers/editCommentController";

export default async function commentRouter(app: FastifyInstance) {
  app.get(
    "/getRepliesByCommentId/:commentId",
    { preHandler: [verifyJWT] },
    () => {}
  );
  app.get(
    "/getMemoryComments/:memoryId",
    { preHandler: [verifyJWT] },
    getMemoryCommentsController
  );
  app.post("/addComment", { preHandler: [verifyJWT] }, addCommentController);
  app.post("/likeComment", { preHandler: [verifyJWT] }, likeCommentController);
  app.post("/unlikeComment", { preHandler: [verifyJWT] }, unlikeCommentController);
  app.post("/deleteComment", { preHandler: [verifyJWT] }, deleteCommentController);
  app.post("/editComment", { preHandler: [verifyJWT] }, editCommentController);
  app.post("/replyComment", { preHandler: [verifyJWT] }, () => {});
}
