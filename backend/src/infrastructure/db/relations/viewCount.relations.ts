import { relations } from "drizzle-orm";
import { viewCounts } from "../schema/viewCountSchema";
import { users } from "../schema/userSchema";
import { memories } from "../schema/memorySchema";

export const viewCountsRelations = relations(viewCounts, ({ one }) => ({
  user: one(users, {
    fields: [viewCounts.user_id],
    references: [users.id],
  }),
  memory: one(memories, {
    fields: [viewCounts.memory_id],
    references: [memories.id],
  }),
}));
