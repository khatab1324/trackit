import { FastifyReply, FastifyRequest } from "fastify";
import { BookmarkInput } from "../../../application/DTO/memorySaveDTO";
import { BookmarkUseCase } from "../../../application/useCase/memory/bookmarkUseCase";
import { BookmarkRepositoryImp } from "../../../infrastructure/repositories/bookmarkRepo";

export const toggleBookmarkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { memory_id } = request.body as { memory_id: string };
    const userReq = request.user as { id: string };
    const currentUserId = userReq.id;
    if (!currentUserId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new BookmarkUseCase(
      new BookmarkRepositoryImp()
    ).toggleBookmark({
      user_id: currentUserId,
      memory_id,
    });

    reply.code(200).send({
      message: "Bookmark processed successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while processing the bookmark" });
  }
};
//TODO: separate getUserBookmarksController and toggleBookmarkController
export const getUserBookmarksController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = (request.user as any).id;
    console.log("Getting bookmarks for user:", userId);

    const bookmarks = await new BookmarkUseCase(
      new BookmarkRepositoryImp()
    ).getUserBookmarks(userId);

    reply.code(200).send({
      message: "User bookmarks retrieved successfully",
      bookmarks,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while getting user bookmarks" });
  }
};
