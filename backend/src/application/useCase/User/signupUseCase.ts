import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { publicUser } from "../../DTO/publicUserDTO";
import { UserSignupInput } from "../../DTO/signupDTO";
import { generateToken } from "../../services/jwtService";
import { CreateUser } from "./createUser";
import bcrypt from "bcrypt";

export class signupUseCase {
  constructor(private userRepe: UserRepoDB) {}
  async execute(userData: UserSignupInput) {
    // Check if username already exists
    const existingUserByUsername = await this.userRepe.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error("username_exists");
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepe.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error("email_exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = await this.userRepe.addUserToDB({
      ...userData,
      password: hashedPassword,
    });

    const token = generateToken(createdUser.id);
    return { createdUser, token };
  }
}
