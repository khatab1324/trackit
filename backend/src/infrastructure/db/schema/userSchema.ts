import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profile_image: text(),
  bio: text(),
  emailVerified: boolean().default(false).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
