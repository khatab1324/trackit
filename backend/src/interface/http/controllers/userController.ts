import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUser } from "../../../application/useCase/User/createUser";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { User } from "../../../domain/entities/User";
import { getUserByTokenUseCase } from "../../../application/useCase/User/getUserByTokenUseCase";
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
