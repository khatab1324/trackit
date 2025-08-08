import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const followRequests = pgTable("follow_requests", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  requester_id: uuid().notNull().references(() => users.id, { onDelete: "cascade" }),
  target_id: uuid().notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar({ length: 20 }).notNull(), // 'pending', 'accepted', 'rejected'
  created_at: timestamp().defaultNow().notNull(),
});