import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
import {
  createUserController,
  getUserByTokenContoller,
  getUserByIdController,
} from "../controllers/userController";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import { string } from "zod";
import { verifyJWT } from "../middlewares/auth";

export default function userRouters(app: FastifyInstance) {
  app.get("/getUserById/:userId", { preHandler: [verifyJWT] }, getUserByIdController);
  app.get("/searchUserByName/:name", { preHandler: [verifyJWT] }, () => {});
  app.post(
    "/user",
    { schema: { body: createUserValidator } },
    createUserController
  );
  app.post("/getUserByToken", getUserByTokenContoller);
}
