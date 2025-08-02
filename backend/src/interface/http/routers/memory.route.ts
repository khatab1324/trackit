import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { createMemoryController } from "../controllers/memoryController";
import { memoryInputValidator } from "../../../application/validators/createMemoryValidator";
import { getCloudinarySignatureController } from "../controllers/getCloudinarySignatureController";
import { getCurrnetUserMemoryController } from "../controllers/getUserMemoryController";

export default async function memoryRouter(app: FastifyInstance) {
  app.post(
    "/memory",
    { preHandler: [verifyJWT], schema: { body: memoryInputValidator } },
    createMemoryController
  );
  app.get(
    "/currentUserMemory",
    { preHandler: [verifyJWT] },
    getCurrnetUserMemoryController
  );
  app.get("/cloudinarySignature", getCloudinarySignatureController);
}
