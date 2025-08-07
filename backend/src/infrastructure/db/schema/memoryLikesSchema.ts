import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { memories } from "./memorySchema";

export const memoryLikes = pgTable("memory_likes", {
  id: uuid().primaryKey().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  memory_id: uuid()
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  create_at: timestamp().defaultNow().notNull(),
});
