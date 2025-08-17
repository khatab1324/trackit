import { eq, sql } from "drizzle-orm";
import { User } from "../../domain/entities/User";
import { UserRepositories } from "../../domain/repositories/UserRepositories";
import { db } from "../db/connection";
import { users } from "../db/schema/userSchema";
import { UserSignupInput } from "../../application/DTO/signupDTO";
import { publicUser, publicUserWithFollowStatus } from "../../application/DTO/publicUserDTO";
import { getTheUserIdFromToken } from "../../application/services/jwtService";
import { follows } from "../db/schema/followsSchema";
import { followRequests } from "../db/schema/followRequestSchema";

export class UserRepoDB implements UserRepositories {
  constructor() {}

  async addUserToDB(user: UserSignupInput): Promise<publicUser> {
    const [createdUser] = await db.insert(users).values(user).returning();
    const { password, ...publicUserData } = createdUser;
    return publicUserData;
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

  async findById(id: string): Promise<publicUser | null> {
    const [userFromDB] = await db.select().from(users).where(eq(users.id, id));
    if (!userFromDB) return null;
    const { password, ...publicUserData } = userFromDB;
    return publicUserData;
  }

  async findByIdWithFollowStatus(id: string, currentUserId: string): Promise<publicUserWithFollowStatus | null> {
    const [userFromDB] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      profile_image: users.profile_image,
      bio: users.bio,
      created_at: users.created_at,
      is_followed: currentUserId === id
        ? sql<boolean>`false`
        : sql<boolean>`EXISTS(
            SELECT 1 FROM ${follows} f
            WHERE f.follower_id = ${currentUserId}
              AND f.followed_id = ${id}
          )`,
      is_requested: currentUserId === id
        ? sql<boolean>`false`
        : sql<boolean>`EXISTS(
            SELECT 1 FROM ${followRequests} fr
            WHERE fr.requester_id = ${currentUserId}
              AND fr.target_id = ${id}
              AND fr.status = 'pending'
          )`,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

    if (!userFromDB) return null;
    return userFromDB;
  }

  async findUserByToken(token: string): Promise<publicUser | null> {
    const userId = getTheUserIdFromToken(token);
    if (!userId) return null;
    const [userFromDB] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!userFromDB) return null;
    const { password, ...publicUserData } = userFromDB;
    return publicUserData;
  }
}
