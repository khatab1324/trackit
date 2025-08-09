import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Id = string;

type Comment = {
  id: Id;
  memoryId: Id;
  userId: Id;
  content: string;
  created_at?: string;
  updated_at?: string;
  parentCommentId?: Id | null;
};
type Reply = Comment;

type AddCommentInput = { memoryId: Id; content: string; parentCommentId?: Id };
type EditCommentInput = { commentId: Id; content: string };
type DeleteCommentInput = { commentId: Id };
type LikeCommentInput = { commentId: Id };
type ReplyCommentInput = { commentId: Id; content: string };

type FollowRequest = {
  id: Id;
  fromUserId: Id;
  toUserId: Id;
  status: "pending" | "accepted" | "rejected";
  created_at?: string;
};
type Follower = { id: Id; userId: Id; followerId: Id };

function providesList<R extends { id: Id }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? [
        { type: tagType as any, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType as any, id })),
      ]
    : [{ type: tagType as any, id: "LIST" }];
}

export const InteractionApi = createApi({
  reducerPath: "InteractionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Comment", "Reply", "FollowRequest", "Follower"] as const,
  endpoints: (builder) => ({
    // Comments
    getRepliesByCommentId: builder.query<Reply[], Id>({
      query: (commentId) => ({
        url: `/getRepliesByCommentId/${commentId}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Reply[]; message: string }) => res.data,
      providesTags: (result) => providesList(result, "Reply"),
    }),
    getMemoryComments: builder.query<Comment[], Id>({
      query: (memoryId) => ({
        url: `/getMemoryComments/${memoryId}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Comment[]; message: string }) =>
        res.data,
      providesTags: (result) => providesList(result, "Comment"),
    }),
    addComment: builder.mutation<Comment, AddCommentInput>({
      query: (body) => ({
        url: "/addComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Comment; message: string }) => res.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Comment", id: "LIST" },
        ...(arg.parentCommentId ? [{ type: "Reply", id: "LIST" }] : []),
      ],
    }),
    likeComment: builder.mutation<{ success: boolean }, LikeCommentInput>({
      query: (body) => ({
        url: "/likeComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Comment", id: arg.commentId },
      ],
    }),
    deleteComment: builder.mutation<{ success: boolean }, DeleteCommentInput>({
      query: (body) => ({
        url: "/deleteComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
      invalidatesTags: () => [{ type: "Comment", id: "LIST" }],
    }),
    editComment: builder.mutation<Comment, EditCommentInput>({
      query: (body) => ({
        url: "/editComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Comment; message: string }) => res.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Comment", id: arg.commentId },
      ],
    }),
    replyComment: builder.mutation<Reply, ReplyCommentInput>({
      query: (body) => ({
        url: "/replyComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Reply; message: string }) => res.data,
      invalidatesTags: () => [
        { type: "Reply", id: "LIST" },
        { type: "Comment", id: "LIST" },
      ],
    }),

    makeFollowRequest: builder.mutation<
      { success: boolean },
      { target_id: Id }
    >({
      query: (body) => ({
        url: "/makeFollowRequest",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
      invalidatesTags: () => [{ type: "FollowRequest", id: "LIST" }],
    }),
    acceptFollowRequest: builder.mutation<
      { success: boolean },
      { requestId: Id }
    >({
      query: (body) => ({
        url: "/acceptFollowRequest",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
      invalidatesTags: () => [
        { type: "FollowRequest", id: "LIST" },
        { type: "Follower", id: "LIST" },
      ],
    }),
    rejectFollowRequest: builder.mutation<
      { success: boolean },
      { requestId: Id }
    >({
      query: (body) => ({
        url: "/rejectFollowRequest",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
      invalidatesTags: () => [{ type: "FollowRequest", id: "LIST" }],
    }),
    getFollowRequests: builder.query<FollowRequest[], void>({
      query: () => ({
        url: "/getFollowRequests",
        method: "GET",
      }),
      transformResponse: (res: { data: FollowRequest[]; message: string }) =>
        res.data,
      providesTags: (result) => providesList(result, "FollowRequest"),
    }),
    getCurrentUserFollowers: builder.query<Follower[], void>({
      query: () => ({
        url: "/getCurrentUserFollowers",
        method: "GET",
      }),
      transformResponse: (res: { data: Follower[]; message: string }) =>
        res.data,
      providesTags: (result) => providesList(result, "Follower"),
    }),
  }),
});

export const {
  // tis for comments
  useGetRepliesByCommentIdQuery,
  useGetMemoryCommentsQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useReplyCommentMutation,
  // thes for follows
  useMakeFollowRequestMutation,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation,
  useGetFollowRequestsQuery,
  useGetCurrentUserFollowersQuery,
} = InteractionApi;
