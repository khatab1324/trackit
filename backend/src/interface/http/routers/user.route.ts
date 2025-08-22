import { FastifyInstance } from "fastify";
import HelloController from "../controllers/helloController";
import {
  createUserController,
  getUserByTokenContoller,
  getUserByIdController,
  updateUsernameController,
  updateBioController,
  updatePasswordController,
} from "../controllers/userController";
import { createUserValidator } from "../../../application/validators/createUserValidator";
import { updateUsernameSchema, updateBioSchema, updatePasswordSchema } from "../../../application/DTO/updateUserDTO";
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
  
  // New routes for updating user information
  app.put(
    "/user/username",
    { 
      preHandler: [verifyJWT],
      schema: { body: updateUsernameSchema }
    },
    updateUsernameController
  );
  
  app.put(
    "/user/bio",
    { 
      preHandler: [verifyJWT],
      schema: { body: updateBioSchema }
    },
    updateBioController
  );
  
  app.put(
    "/user/password",
    { 
      preHandler: [verifyJWT],
      schema: { body: updatePasswordSchema }
    },
    updatePasswordController
  );
}
