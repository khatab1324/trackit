import { relations } from "drizzle-orm";
import { accounts } from "../schema/accountSchema";
import { users } from "../schema/userSchema";

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.user_id],
    references: [users.id],
  }),
}));
