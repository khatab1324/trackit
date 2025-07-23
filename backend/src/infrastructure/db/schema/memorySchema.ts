import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { real } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const memories = pgTable("memories", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id,{ onDelete: "cascade" }),
  title: varchar({ length: 150 }).notNull(),
  description: text(),
  content_url: text(),
  content_type: varchar({ length: 50 }),
  latitude: real(),
  longitude: real(),
  emotion: varchar({ length: 50 }),
  memory_date: date(),
  privacy: varchar({ length: 50 }),
  created_at: timestamp().defaultNow().notNull(),
});
