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
import { boolean } from "drizzle-orm/pg-core";
import { ContentType } from "../../../application/DTO/memoryInputDTO";

export const memories = pgTable("memories", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar({ length: 150 }).notNull(),
  description: text(),
  content_url: text().notNull(),
  content_type: varchar({ length: 50 }).$type<ContentType>().notNull(),
  latitude: real().notNull(),
  longitude: real().notNull(),
  isPublic: boolean().default(true).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
