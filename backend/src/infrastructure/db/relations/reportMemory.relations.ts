import { relations } from "drizzle-orm";
import { reportMemories } from "../schema/ReportMemorySchema";
import { users } from "../schema/userSchema";
import { memories } from "../schema/memorySchema";

export const reportMemoriesRelations = relations(reportMemories, ({ one }) => ({
  reporter: one(users, {
    fields: [reportMemories.reporter_id],
    references: [users.id],
  }),
  memory: one(memories, {
    fields: [reportMemories.memory_id],
    references: [memories.id],
  }),
}));
