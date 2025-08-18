import { FastifyInstance } from "fastify";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import {
  signinController,
  signupController,
} from "../controllers/authController";
import { verifyEmailController } from "../controllers/emailVerificationController";

export default function authRoute(app: FastifyInstance) {
  app.post("/signin", signinController);
  app.post(
    "/signup",
    { schema: { body: createUserValidator } },
    signupController
  );
  app.post("/verify-email", verifyEmailController);
}
