import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const commentsReplys = pgTable("comments_replys", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  memory_id: uuid().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
