import { pgTable, uuid, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  email: varchar({ length: 100 }).notNull(),
  token: varchar({ length: 255 }), // Optional for backward compatibility
  verificationCode: integer().notNull(), // 6-digit verification code
  expires: timestamp().notNull(),
});
