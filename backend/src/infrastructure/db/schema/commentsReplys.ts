import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const commentsReplys = pgTable("comments_replys", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  commentsReplys: text().notNull(),
  comment_id: uuid().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
