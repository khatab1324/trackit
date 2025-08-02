import { FastifyInstance } from "fastify";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import {
  signinController,
  signupController,
} from "../controllers/authController";

export default function authRoute(app: FastifyInstance) {
  app.post("/signin", signinController);
  app.post(
    "/signup",
    { schema: { body: createUserValidator } },
    signupController
  );
}
