import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { SigninInput } from "../../DTO/signinDTO";
import bcrypt from "bcrypt";
import { generateToken } from "../../services/jwtService";
export class signinUseCase {
  constructor(private userRepe: UserRepoDB) {}
  async execute(userData: SigninInput) {
    const existUser = await this.userRepe.findByUsername(userData.username);
    if (!existUser) {
      throw new Error("user is not exist");
    }
    const isMatch = await bcrypt.compare(userData.password, existUser.password);
    if (!isMatch) throw new Error("Invalid password");

    const { password, ...publicUser } = existUser;
    const token = generateToken(existUser.id);
    
    return { user: publicUser, token };
  }
}
