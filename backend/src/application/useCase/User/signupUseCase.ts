import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { publicUser } from "../../DTO/publicUserDTO";
import { UserSignupInput } from "../../DTO/signupDTO";
import { generateToken } from "../../services/jwtService";
import { CreateUser } from "./createUser";
import bcrypt from "bcrypt";

export class signupUseCase {
  constructor(private userRepe: UserRepoDB) {}
  async execute(userData: UserSignupInput) {
    const exitUser = await this.userRepe.findByUsername(userData.username);
    if (exitUser) throw new Error("user is exist ^_^");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = await this.userRepe.addUserToDB({
      ...userData,
      password: hashedPassword,
    });

    const token = generateToken(createdUser.id);
    return { createdUser, token };
  }
}
