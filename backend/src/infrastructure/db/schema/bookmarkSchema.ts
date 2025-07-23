import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { memories } from "./memorySchema";

export const bookmarks = pgTable("bookmarks", {
    id: uuid().primaryKey().defaultRandom().notNull(),
    user_id: uuid().notNull().references(() => users.id),
    memory_id: uuid().notNull().references(() => memories.id),
    saved_at: timestamp().defaultNow(),
  });