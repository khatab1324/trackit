import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { createMemoryController } from "../controllers/memoryController";
import { memoryInputValidator } from "../../../application/validators/createMemoryValidator";
import { getCloudinarySignatureController } from "../controllers/getCloudinarySignatureController";
import { getCurrnetUserMemoryController } from "../controllers/getUserMemoryController";
import { getMemroyByIdController } from "../controllers/getMemoryByIdController";
import { GetNearMemoryController } from "../controllers/getNearMemoryController";

export default async function memoryRouter(app: FastifyInstance) {
  app.post(
    "/memory",
    { preHandler: [verifyJWT], schema: { body: memoryInputValidator } },
    createMemoryController
  );
  app.get(
    "/currentUserMemories",
    { preHandler: [verifyJWT] },
    getCurrnetUserMemoryController
  );
  app.post(
    "/getNearMemroy",
    { preHandler: [verifyJWT] },
    GetNearMemoryController
  );
  app.get<{ Params: { memoryId: string } }>(
    "/getMemroyById/:memoryId",
    { preHandler: [verifyJWT] },
    getMemroyByIdController
  );
  app.get("/cloudinarySignature", getCloudinarySignatureController);
}
