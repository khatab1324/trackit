import { relations } from "drizzle-orm";
import { commentsReplys } from "../schema/commentsReplys";
import { users } from "../schema/userSchema";
import { memories } from "../schema/memorySchema";

export const commentsReplysRelations = relations(commentsReplys, ({ one }) => ({
  user: one(users, {
    fields: [commentsReplys.user_id],
    references: [users.id],
  }),
  memory: one(memories, {
    fields: [commentsReplys.memory_id],
    references: [memories.id],
  }),
}));
