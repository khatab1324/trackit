import { relations } from "drizzle-orm";
import { follows } from "../schema/followsSchema";
import { users } from "../schema/userSchema";

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.follower_id],
    references: [users.id],
    relationName: "followers",
  }),
  followed: one(users, {
    fields: [follows.followed_id],
    references: [users.id],
    relationName: "following",
  }),
}));
