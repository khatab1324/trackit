import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const follows = pgTable("follows", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  follower_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followed_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
});
