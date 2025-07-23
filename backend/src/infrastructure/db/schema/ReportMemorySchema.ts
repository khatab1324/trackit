import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { memories } from "./memorySchema";

export const reportMemories = pgTable("report_memories", {
  report_id: uuid().primaryKey().defaultRandom().notNull(),
  reporter_id: uuid()
    .notNull()
    .references(() => users.id,{ onDelete: "cascade" }),
  memory_id: uuid()
    .notNull()
    .references(() => memories.id,{ onDelete: "cascade" }),
  reason: text(),
  reported_at: timestamp().defaultNow().notNull(),
  status: varchar({ length: 50 }),
  report_category: varchar({ length: 100 }),
});
