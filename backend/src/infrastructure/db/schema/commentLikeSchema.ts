import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const commentLikes = pgTable("comment_likes", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  comment_id: uuid().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
