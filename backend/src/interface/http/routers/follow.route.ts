import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  getFollowRequestsController,
} from "../controllers/followRequestController";

export default async function followRouter(app: FastifyInstance) {
  app.post("/makeFollowRequest", { preHandler: [verifyJWT] }, sendFollowRequestController);
  app.post("/acceptFollowRequest", { preHandler: [verifyJWT] }, acceptFollowRequestController);
  app.post("/rejectFollowRequest", { preHandler: [verifyJWT] }, rejectFollowRequestController);
  app.get("/getFollowRequests", { preHandler: [verifyJWT] }, getFollowRequestsController);
}
