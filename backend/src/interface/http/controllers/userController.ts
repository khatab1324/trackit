import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUser } from "../../../application/useCase/User/createUser";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { User } from "../../../domain/entities/User";
import { getUserByTokenUseCase } from "../../../application/useCase/User/getUserByTokenUseCase";
import { getUserByIdUseCase } from "../../../application/useCase/User/getUserByIdUseCase";
import { UpdateUsernameUseCase } from "../../../application/useCase/User/updateUsernameUseCase";
import { UpdateBioUseCase } from "../../../application/useCase/User/updateBioUseCase";
import { UpdatePasswordUseCase } from "../../../application/useCase/User/updatePasswordUseCase";

const userRepoDb = new UserRepoDB();
const createUserUseCase = new CreateUser(userRepoDb);

export const createUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.body as User;
    await createUserUseCase.execute(user);
    reply.code(201).send({ message: "User created successfully" });
  } catch (error) {
    reply
      .code(500)
      .send({ error: "An error occurred while creating the user" });
  }
};

export const getUserByTokenContoller = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.body) throw new Error("token is undefined");
    const { token } = request.body as { token: string };
    const userRepoDb = new UserRepoDB();
    const UserByTokenUseCase = new getUserByTokenUseCase(userRepoDb);
    const data = await UserByTokenUseCase.execute(token);
    reply.code(201).send({ message: "User created successfully", user: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    reply.code(500).send({
      message: "An error occurred while retrieving the user",
      error: errorMessage,
    });
  }
};

export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {

    const { userId } = request.params;
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    
    if (!userId || !currentUserId) {
      return reply.code(400).send({ error: "User ID or current user ID is required" });
    }

    const userRepoDb = new UserRepoDB();
    const getUserByIdUseCaseInstance = new getUserByIdUseCase(userRepoDb);
    const user = await getUserByIdUseCaseInstance.execute(userId,currentUserId);
    
    reply.code(200).send({
      message: "User retrieved successfully",
      user: user,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    reply.code(500).send({
      message: "An error occurred while retrieving the user",
      error: errorMessage,
    });
  }
};

export const updateUsernameController = async (
  request: FastifyRequest<{ Body: { username: string } }>,
  reply: FastifyReply
) => {
  try {
    const { username } = request.body;
    const userReq = request.user as { id: string };
    const userId = userReq.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const updateUsernameUseCase = new UpdateUsernameUseCase(userRepoDb);
    await updateUsernameUseCase.execute(userId, { username });

    reply.code(200).send({ message: "Username updated successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    reply.code(400).send({
      message: "Failed to update username",
      error: errorMessage,
    });
  }
};

export const updateBioController = async (
  request: FastifyRequest<{ Body: { bio: string } }>,
  reply: FastifyReply
) => {
  try {
    const { bio } = request.body;
    const userReq = request.user as { id: string };
    const userId = userReq.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const updateBioUseCase = new UpdateBioUseCase(userRepoDb);
    await updateBioUseCase.execute(userId, { bio });

    reply.code(200).send({ message: "Bio updated successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    reply.code(400).send({
      message: "Failed to update bio",
      error: errorMessage,
    });
  }
};

export const updatePasswordController = async (
  request: FastifyRequest<{ Body: { currentPassword: string; newPassword: string } }>,
  reply: FastifyReply
) => {
  try {
    const { currentPassword, newPassword } = request.body;
    const userReq = request.user as { id: string };
    const userId = userReq.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const updatePasswordUseCase = new UpdatePasswordUseCase(userRepoDb);
    await updatePasswordUseCase.execute(userId, { currentPassword, newPassword });

    reply.code(200).send({ message: "Password updated successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    reply.code(400).send({
      message: "Failed to update password",
      error: errorMessage,
    });
  }
};
