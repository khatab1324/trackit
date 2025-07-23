import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../../../domain/entities/User";
import { UserSignupInput } from "../../../application/DTO/signupDTO";
import { signupUseCase } from "../../../application/useCase/User/signupUseCase";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { SigninInput } from "../../../application/DTO/signinDTO";
import { signinUseCase } from "../../../application/useCase/User/signinUseCase";

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

export const signinController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.body as SigninInput;
    const userSigninUseCase = await new signinUseCase(new UserRepoDB()).execute(
      user
    );
    reply
      .code(201)
      .send({ message: "User found successfully", data: userSigninUseCase });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      message: "An error occurred while creating the user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 
