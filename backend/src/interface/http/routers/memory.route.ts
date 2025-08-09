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
import { getAllMemoriesController } from "../controllers/getAllMemoriesController";
import { getUserFriendsMemoriesController } from "../controllers/getUserFriendsMemoriesController";

export default async function memoryRouter(app: FastifyInstance) {
  app.get(
    "/currentUserMemories",
    { preHandler: [verifyJWT] },
    getCurrnetUserMemoryController
  );

  app.get<{ Params: { memoryId: string } }>(
    "/getMemoryById/:memoryId",
    { preHandler: [verifyJWT] },
    getMemroyByIdController
  );
  app.get(
    "/getMemories",
    { preHandler: [verifyJWT] },
    getAllMemoriesController
  );

  app.get(
    "/getUserMemoryArchive",
    { preHandler: [verifyJWT] },
    getUserArchivedMemoriesController
  );
  app.get(
    "/userBookmarks",
    { preHandler: [verifyJWT] },
    getUserBookmarksController
  );
  app.post(
    "/memory",
    { preHandler: [verifyJWT], schema: { body: memoryInputValidator } },
    createMemoryController
  );
  app.post(
    "/getNearMemroyMemo",
    { preHandler: [verifyJWT] },
    GetNearMemoryController
  );
  app.post("/memoryViewd", { preHandler: [verifyJWT] }, memoryViewController);
  app.post("/getNearMemroyMap", { preHandler: [verifyJWT] }, () => {});
  app.post("/memoryLike", { preHandler: [verifyJWT] }, memoryLikeController);
  app.post(
    "/memorySave",
    { preHandler: [verifyJWT] },
    toggleBookmarkController
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
  app.get(
    "/getUserFriendsMemories",
    { preHandler: [verifyJWT] },
    getUserFriendsMemoriesController
  );
}
