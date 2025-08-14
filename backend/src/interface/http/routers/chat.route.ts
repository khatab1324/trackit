import { FastifyInstance } from "fastify";
import {
  getChatByIdController,
  getOrCreateChatBetweenUsersController,
  getGroupsController,
  getGroupByIdController,
  createGroupController,
} from "../controllers/chatController";
import { verifyJWT } from "../middlewares/auth";

export default function chatRoute(app: FastifyInstance) {
  app.get("/chat/:chatId", { preHandler: verifyJWT }, getChatByIdController);
  app.get("/getChat/:friendId", { preHandler: verifyJWT }, getOrCreateChatBetweenUsersController);

  // Group chat routes
  app.get("/groups", { preHandler: verifyJWT }, getGroupsController);
  app.get("/group/:groupId", { preHandler: verifyJWT }, getGroupByIdController);
  app.post("/group", { preHandler: verifyJWT }, createGroupController);
} 