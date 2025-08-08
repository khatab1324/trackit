import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/auth";
import { createMemoryController } from "../controllers/memoryController";
import { memoryInputValidator } from "../../../application/validators/createMemoryValidator";
import { getCloudinarySignatureController } from "../controllers/getCloudinarySignatureController";
import { getCurrnetUserMemoryController } from "../controllers/getUserMemoryController";
import { getMemroyByIdController } from "../controllers/getMemoryByIdController";
import { GetNearMemoryController } from "../controllers/getNearMemoryController";
import { memoryLikeController } from "../controllers/memoryLikeController";
import {
  toggleBookmarkController,
  getUserBookmarksController,
} from "../controllers/bookmarkController";
import { memoryViewController } from "../controllers/memoryViewController";
import {
  archiveMemoryController,
  unarchiveMemoryController,
  getUserArchivedMemoriesController,
} from "../controllers/memoryArchiveController";

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
    "/getNearMemroyMemo",
    { preHandler: [verifyJWT] },
    GetNearMemoryController
  );
  app.get<{ Params: { memoryId: string } }>(
    "/getMemroyById/:memoryId",
    { preHandler: [verifyJWT] },
    getMemroyByIdController
  );

  app.get(
    "/getUserMemoryArchive",
    { preHandler: [verifyJWT] },
    getUserArchivedMemoriesController
  );
  app.post("/memoryViewd", { preHandler: [verifyJWT] }, memoryViewController);
  app.post("/getNearMemroyMap", { preHandler: [verifyJWT] }, () => {});
  app.post("/memoryLike", { preHandler: [verifyJWT] }, memoryLikeController);
  app.post(
    "/memorySave",
    { preHandler: [verifyJWT] },
    toggleBookmarkController
  );
  app.get(
    "/userBookmarks",
    { preHandler: [verifyJWT] },
    getUserBookmarksController
  );
  app.post(
    "/memoryArchive",
    { preHandler: [verifyJWT] },
    archiveMemoryController
  );
  app.post(
    "/memoryUnarchive",
    { preHandler: [verifyJWT] },
    unarchiveMemoryController
  );
  app.post("/memoryDelete", { preHandler: [verifyJWT] }, () => {});

  app.get("/cloudinarySignature", getCloudinarySignatureController);
}
