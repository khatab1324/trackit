import { relations } from "drizzle-orm";
import { users } from "../schema/userSchema";
import { accounts } from "../schema/accountSchema";
import { memories } from "../schema/memorySchema";
import { archivedMemories } from "../schema/archiveMemory";
import { commentsReplys } from "../schema/commentsReplys";
import { commentLikes } from "../schema/commentLikeSchema";
import { reportMemories } from "../schema/ReportMemorySchema";
import { bookmarks } from "../schema/bookmarkSchema";
import { follows } from "../schema/followsSchema";
import { viewCounts } from "../schema/viewCountSchema";

export const userRelations = relations(users, ({ one, many }) => ({
  accounts: one(accounts, {
    fields: [users.id],
    references: [accounts.user_id],
  }),
  memories: many(memories),
  archivedMemories: many(archivedMemories),
  commentsReplys: many(commentsReplys),
  commentLikes: many(commentLikes),
  reportMemories: many(reportMemories),
  bookmarks: many(bookmarks),
  followersRelation: many(follows, { relationName: "followers" }),
  followingRelation: many(follows, { relationName: "following" }),
  viewCounts: many(viewCounts),
}));
