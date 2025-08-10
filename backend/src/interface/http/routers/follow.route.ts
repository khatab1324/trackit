import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  cancelFollowRequestController,
  getFollowRequestsController,
  getCurrentUserFollowersController,
} from "../controllers/followRequestController";

export default async function followRouter(app: FastifyInstance) {
  app.post("/makeFollowRequest", { preHandler: [verifyJWT] }, sendFollowRequestController);
  app.post("/acceptFollowRequest", { preHandler: [verifyJWT] }, acceptFollowRequestController);
  app.post("/rejectFollowRequest", { preHandler: [verifyJWT] }, rejectFollowRequestController);
  app.post("/cancelFollowRequest", { preHandler: [verifyJWT] }, cancelFollowRequestController);
  app.get("/getFollowRequests", { preHandler: [verifyJWT] }, getFollowRequestsController);
  app.get("/getCurrentUserFollowers", { preHandler: [verifyJWT] }, getCurrentUserFollowersController);
}
