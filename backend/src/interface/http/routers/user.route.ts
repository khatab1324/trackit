import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
import { createUserController } from "../controllers/userController";
import { createUserValidator } from "../../../application/validators/createUserValidator";

export default function userRouters(app: FastifyInstance) {
  app.post(
    "/user",
    { schema: { body: createUserValidator } },
    createUserController
  );
}
