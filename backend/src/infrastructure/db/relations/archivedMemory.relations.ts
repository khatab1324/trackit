import { relations } from "drizzle-orm";
import { archivedMemories } from "../schema/archiveMemory";
import { users } from "../schema/userSchema";

export const archivedMemoriesRelations = relations(
  archivedMemories,
  ({ one }) => ({
    user: one(users, {
      fields: [archivedMemories.user_id],
      references: [users.id],
    }),
  })
);
