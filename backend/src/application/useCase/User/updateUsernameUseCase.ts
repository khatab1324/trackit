import { UserRepositories } from "../../../domain/repositories/UserRepositories";
import { UpdateUsernameInput } from "../../DTO/updateUserDTO";

export class UpdateUsernameUseCase {
  constructor(private userRepository: UserRepositories) {}

  async execute(userId: string, data: UpdateUsernameInput): Promise<void> {
    // Check if username is already taken by another user
    const existingUser = await this.userRepository.findByUsername(data.username);
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already taken");
    }

    // Update the username
    await this.userRepository.updateUsername(userId, data.username);
  }
} 