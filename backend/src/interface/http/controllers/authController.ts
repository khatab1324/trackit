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
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === "username_exists") {
        reply.code(409).send({ 
          error: "Username already exists",
          message: "This username is already taken. Please choose a different username."
        });
        return;
      }
      
      if (error.message === "email_exists") {
        reply.code(409).send({ 
          error: "Email already exists",
          message: "This email is already registered. Please use a different email address."
        });
        return;
      }
      
      // Handle legacy error messages for backward compatibility
      if (error.message.includes("user is exist")) {
        reply.code(409).send({ 
          error: "Username or email already exists",
          message: "A user with this username or email already exists"
        });
        return;
      }
    }
    
    reply.code(500).send({ 
      error: "Internal server error",
      message: "An error occurred while creating the user" 
    });
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
      .code(200)
      .send({ message: "User signed in successfully", data: userSigninUseCase });
  } catch (error) {
    console.log(error);
    
    if (error instanceof Error) {
      if (error.message === "user is not exist") {
        reply.code(401).send({ 
          error: "Invalid credentials",
          message: "Username or password is incorrect"
        });
        return;
      }
      
      if (error.message === "Invalid password") {
        reply.code(401).send({ 
          error: "Invalid credentials",
          message: "Username or password is incorrect"
        });
        return;
      }
      
      if (error.message === "email_not_verified") {
        reply.code(403).send({ 
          error: "Email not verified",
          message: "Please verify your email address before signing in"
        });
        return;
      }
    }
    
    reply.code(500).send({ 
      error: "Internal server error",
      message: "An error occurred during signin" 
    });
  }
}; 
