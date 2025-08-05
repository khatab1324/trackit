import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { memories } from "./memorySchema";

export const memoryComments = pgTable("memory_comments", {
  id: uuid().primaryKey().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  comment_text: varchar().notNull(),
  memory_id: uuid()
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  create_at: timestamp().defaultNow().notNull(),
});
