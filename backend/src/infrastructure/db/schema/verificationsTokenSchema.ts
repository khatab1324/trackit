import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  email: varchar({ length: 100 }).notNull(),
  token: varchar({ length: 255 }).notNull(),
  expires: timestamp().notNull(),
});
