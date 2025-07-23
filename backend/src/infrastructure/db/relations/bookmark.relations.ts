import { relations } from "drizzle-orm";
import { bookmarks } from "../schema/bookmarkSchema";
import { users } from "../schema/userSchema";
import { memories } from "../schema/memorySchema";

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.user_id],
    references: [users.id],
  }),
  memory: one(memories, {
    fields: [bookmarks.memory_id],
    references: [memories.id],
  }),
}));
