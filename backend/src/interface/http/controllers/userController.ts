import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUser } from "../../../application/useCase/User/createUser";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { User } from "../../../domain/entities/User";
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
    reply.code(500).send({ error: "An error occurred while creating the user" });
  }
};

