import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
import { createUserController } from "../controllers/userController";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import { signupController } from "../controllers/authController";

export default function authRoute(app: FastifyInstance) {
  app.post("/signin", createUserController);
  app.post(
    "/signup",
    { schema: { body: createUserValidator } },
    signupController
  );
}
