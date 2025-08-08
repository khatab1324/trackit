import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { addCommentController } from "../controllers/commentController";

export default async function commentRouter(app: FastifyInstance) {
  app.get(
    "/getRepliesByCommentId/:commentId",
    { preHandler: [verifyJWT] },
    () => {}
  );
  app.get(
    "/getMemoryComments/:memoryId",
    { preHandler: [verifyJWT] },
    () => {}
  );
  app.post("/addComment", { preHandler: [verifyJWT] }, addCommentController);
  app.post("/likeComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/deleteComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/editComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/replyComment", { preHandler: [verifyJWT] }, () => {});
}
