import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";

export default function commentRouter(app: FastifyInstance) {
  app.get(
    "/getRepliesByCommentId/:commentId",
    { preHandler: [verifyJWT] },
    () => {}
  );
  app.post("/likeComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/deleteComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/editComment", { preHandler: [verifyJWT] }, () => {});
  app.post("/replyComment", { preHandler: [verifyJWT] }, () => {});
}
