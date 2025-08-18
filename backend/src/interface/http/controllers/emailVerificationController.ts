import { FastifyReply, FastifyRequest } from "fastify";
import { VerifyEmailUseCase } from "../../../application/useCase/User/verifyEmailUseCase";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";

export const verifyEmailController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, verificationCode } = request.body as { 
      email: string; 
      verificationCode: number; 
    };
    
    if (!email || !verificationCode) {
      return reply.code(400).send({ 
        error: "Missing required fields",
        message: "Email and verification code are required" 
      });
    }

    const verifyEmailUseCase = new VerifyEmailUseCase(new UserRepoDB());
    const result = await verifyEmailUseCase.execute(email, verificationCode);
    
    reply.code(200).send({ 
      message: "Email verified successfully", 
      data: result 
    });
  } catch (error) {
    console.log(error);
    
    if (error instanceof Error) {
      if (error.message === "Invalid or expired verification code") {
        reply.code(400).send({ 
          error: "Invalid verification code",
          message: "The verification code is invalid or has expired. Please request a new one."
        });
        return;
      }
      
      if (error.message === "User not found") {
        reply.code(404).send({ 
          error: "User not found",
          message: "No user found with this email address."
        });
        return;
      }
    }
    
    reply.code(500).send({ 
      error: "Internal server error",
      message: "An error occurred while verifying the email" 
    });
  }
}; 