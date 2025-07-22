import { eq } from "drizzle-orm";
import { User } from "../../domain/entities/User";
import { UserRepositories } from "../../domain/repositories/UserRepositories";
import { db } from "../db/connection";
import { users } from "../db/schema/userSchema";
import { UserSignupInput } from "../../application/DTO/signupDTO";
import { publicUser } from "../../application/DTO/publicUserDTO";

export class UserRepoDB implements UserRepositories {
  constructor() {}

  async addUserToDB(user: UserSignupInput): Promise<publicUser> {
    const [createdUser] = await db.insert(users).values(user).returning();
    const { password, ...publicUser } = createdUser;
    return publicUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [userFromDB] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return userFromDB;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [userFromDB] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return userFromDB;
  }
}
