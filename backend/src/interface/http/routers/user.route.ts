import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
import {
  createUserController,
  getUserByTokenContoller,
} from "../controllers/userController";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import { string } from "zod";

export default function userRouters(app: FastifyInstance) {
  app.post(
    "/user",
    { schema: { body: createUserValidator } },
    createUserController
  );
  app.post("/getUserByToken", getUserByTokenContoller);
}
