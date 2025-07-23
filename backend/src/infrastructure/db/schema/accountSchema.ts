import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar({ length: 50 }),
  provider: varchar({ length: 100 }),
  provider_account_id: varchar({ length: 255 }),
  refresh_token: text(),
  access_token: text(),
  expires_at: timestamp(),
  token_type: varchar({ length: 50 }),
  scope: varchar({ length: 255 }),
  id_token: text(),
  session_state: varchar({ length: 255 }),
});
