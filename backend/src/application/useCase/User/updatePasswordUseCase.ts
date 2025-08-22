import bcrypt from "bcrypt";
import { UserRepositories } from "../../../domain/repositories/UserRepositories";
import { UpdatePasswordInput } from "../../DTO/updateUserDTO";

export class UpdatePasswordUseCase {
  constructor(private userRepository: UserRepositories) {}

  async execute(userId: string, data: UpdatePasswordInput): Promise<void> {
    // Get current user to verify old password
    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get full user data including password for verification
    const fullUser = await this.userRepository.findByIdWithPassword(userId);
    if (!fullUser) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, fullUser.password);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

    // Update password
    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }
} 