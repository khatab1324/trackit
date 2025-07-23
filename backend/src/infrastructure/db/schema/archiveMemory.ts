import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const archivedMemories = pgTable("archived_memories", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar({ length: 150 }),
  description: text(),
  media_urls: text(),
  location: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  memory_date: date(),
  archived_date: timestamp().defaultNow(),
});
