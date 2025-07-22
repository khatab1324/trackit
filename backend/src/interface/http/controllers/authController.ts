import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../../../domain/entities/User";
import { UserSignupInput } from "../../../application/DTO/signupDTO";
import { signupUseCase } from "../../../application/useCase/User/signupUseCase";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";

export const signupController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.body as UserSignupInput;
    const userSignupUseCase = await new signupUseCase(new UserRepoDB()).execute(
      user
    );
    reply
      .code(201)
      .send({ message: "User created successfully", data: userSignupUseCase });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while creating the user" });
  }
};
