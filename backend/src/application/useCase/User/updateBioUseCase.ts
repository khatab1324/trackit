import { UserRepositories } from "../../../domain/repositories/UserRepositories";
import { UpdateBioInput } from "../../DTO/updateUserDTO";

export class UpdateBioUseCase {
  constructor(private userRepository: UserRepositories) {}

  async execute(userId: string, data: UpdateBioInput): Promise<void> {
    await this.userRepository.updateBio(userId, data.bio || "");
  }
} 