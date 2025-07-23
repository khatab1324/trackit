import { relations } from "drizzle-orm";
import { memories } from "../schema/memorySchema";
import { users } from "../schema/userSchema";
import { commentsReplys } from "../schema/commentsReplys";
import { commentLikes } from "../schema/commentLikeSchema";
import { reportMemories } from "../schema/ReportMemorySchema";
import { bookmarks } from "../schema/bookmarkSchema";
import { viewCounts } from "../schema/viewCountSchema";

export const memoriesRelations = relations(memories, ({ one, many }) => ({
  user: one(users, {
    fields: [memories.user_id],
    references: [users.id],
  }),
  //TODO: think do we need to get commentsReplays
  commentsReplys: many(commentsReplys),
  commentLikes: many(commentLikes),
  reportMemories: many(reportMemories),
  bookmarks: many(bookmarks),
  viewCounts: many(viewCounts),
}));
