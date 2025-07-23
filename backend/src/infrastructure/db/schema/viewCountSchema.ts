import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { memories } from "./memorySchema";

export const viewCounts = pgTable("view_counts", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  memory_id: uuid()
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  viewed_at: timestamp().defaultNow().notNull(),
});
