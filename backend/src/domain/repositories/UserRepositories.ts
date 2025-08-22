import { publicUser, publicUserWithFollowStatus } from "../../application/DTO/publicUserDTO";
import { UserSignupInput } from "../../application/DTO/signupDTO";
import { User } from "../entities/User";

export interface UserRepositories {
  addUserToDB(user: UserSignupInput): Promise<publicUser>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<publicUser | null>;
  findByIdWithFollowStatus(id: string, currentUserId: string): Promise<publicUserWithFollowStatus | null>;
  updateUsername(userId: string, username: string): Promise<void>;
  updateBio(userId: string, bio: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  findByIdWithPassword(id: string): Promise<User | null>;
}
