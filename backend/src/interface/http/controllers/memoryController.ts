import { FastifyReply, FastifyRequest } from "fastify";
import { MemoryInput } from "../../../application/DTO/memoryInputDTO";
import { uploadImageToCloudinaryService } from "../../../application/services/uploadImageToCloudinary";
import { CreateMemoryUseCase } from "../../../application/useCase/memory/createMemoriesUseCase";
import { MemoryRepositoryImp } from "../../../infrastructure/repositories/memoryRepo";
import { MultipartFile } from "@fastify/multipart";

export const createMemoryController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const memoryData = request.body as MemoryInput;
    //TODO add this to usecase
    console.log("memoryData :", memoryData);

    new CreateMemoryUseCase(new MemoryRepositoryImp()).execute(memoryData);
    reply.code(201).send({ message: "Memory created successfully" });
  } catch (error) {
    console.log(error);

    reply
      .code(500)
      .send({ error: "An error occurred while creating the user" });
  }
};
