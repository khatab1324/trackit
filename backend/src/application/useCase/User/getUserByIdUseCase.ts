import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { publicUserWithFollowStatus } from "../../DTO/publicUserDTO";

export class getUserByIdUseCase {
  constructor(private UserRepo: UserRepoDB) {}
  
  async execute(userId: string, currentUserId: string): Promise<publicUserWithFollowStatus> {
    const userFromDB = await this.UserRepo.findByIdWithFollowStatus(userId, currentUserId);
    if (!userFromDB)
      throw new Error("User not found with the provided ID");
    return userFromDB;
  }
} 