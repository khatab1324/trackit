import { User } from "../../../domain/entities/User";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { publicUser } from "../../DTO/publicUserDTO";

export class getUserByTokenUseCase {
  constructor(private UserRepo: UserRepoDB) {}
  async execute(token: string): Promise<publicUser> {
    const userFromDB = await this.UserRepo.findUserByToken(token);
    if (!userFromDB)
      throw new Error("can't get user by token ,maby not valid token");
    return userFromDB;
  }
}
