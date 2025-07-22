import { User } from "../../../domain/entities/User";
import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { publicUser } from "../../DTO/publicUserDTO";

export class CreateUser {
  constructor(private UserRepo: UserRepoDB) {}
  async execute(user: User): Promise<publicUser> {
    const getTheUser = await this.UserRepo.findByEmail(user.email);
    if (getTheUser) throw new Error("user is exist ^_^");
    const createUser = await this.UserRepo.addUserToDB(user);
    return createUser;
  }
}
