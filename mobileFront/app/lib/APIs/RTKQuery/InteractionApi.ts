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

type AddCommentInput = { memory_id: Id; content: string; parentCommentId?: Id };
type EditCommentInput = { commentId: Id; content: string };
type DeleteCommentInput = { commentId: Id };
type LikeCommentInput = { commentId: Id };
type ReplyCommentInput = { commentId: Id; content: string };

type FollowRequest = {
  id: Id;
  requester_id: Id;
  target_id: Id;
  status: "pending" | "accepted" | "rejected";
  created_at?: string;
};
type Follower = { id: Id; userId: Id; followerId: Id };

type BookmarkResponse = {
  success: boolean;
  message: string;
  isBookmarked?: boolean;
};

type BookmarkedMemory = {
  id: string;
  memory_id: string;
  saved_at: string;
  memory: {
    id: string;
    title: string;
    description?: string;
    content_url: string;
    content_type: string;
    latitude: number;
    longitude: number;
    isPublic: boolean;
    created_at: string;
    user: {
      id: string;
      username: string;
      profile_image: string;
      bio: string;
    };
  };
};

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
  tagTypes: [
    "Comment",
    "Reply",
    "FollowRequest",
    "Follower",
    "Memory",
    "UserMemory",
    "BookmarkedMemory",
  ] as const,
  endpoints: (builder) => ({
    // Comments
    getRepliesByCommentId: builder.query<Reply[], Id>({
      query: (commentId) => ({
        url: `/getRepliesByCommentId/${commentId}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Reply[]; message: string }) => res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),
    
    getMemoryComments: builder.query<Comment[], Id>({
      query: (memoryId) => ({
        url: `/getMemoryComments/${memoryId}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Comment[]; message: string }) =>
        res.data,
      keepUnusedDataFor: 0, // Disable caching
      // Add error handling
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("getMemoryComments query failed:", error);
        }
      },
    }),
    
    addComment: builder.mutation<Comment, AddCommentInput>({
      query: (body) => ({
        url: "/addComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Comment; message: string }) => res.data,
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
    }),
    
    editComment: builder.mutation<Comment, EditCommentInput>({
      query: (body) => ({
        url: "/editComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Comment; message: string }) => res.data,
    }),
    
    replyComment: builder.mutation<Reply, ReplyCommentInput>({
      query: (body) => ({
        url: "/replyComment",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Reply; message: string }) => res.data,
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
      transformResponse: (res: { data: { success: boolean }; message: string }) => res.data,
    }),
    
    cancelFollowRequest: builder.mutation<
      { success: boolean },
      { target_id: Id }
    >({
      query: (body) => ({
        url: "/cancelFollowRequest",
        method: "POST",
        body,
      }),
      transformResponse: (res: {
        data: { success: boolean };
        message: string;
      }) => res.data,
    }),
    
    acceptFollowRequest: builder.mutation<
      { success: boolean },
      { request_id: Id }
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
    }),
    
    rejectFollowRequest: builder.mutation<
      { success: boolean },
      { request_id: Id }
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
    }),
    
    getFollowRequests: builder.query<FollowRequest[], void>({
      query: () => ({
        url: "/getFollowRequests",
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Disable caching - always fetch fresh data
      transformResponse: (res: { data: FollowRequest[]; message: string }) =>
        res.data,
    }),
    
    getCurrentUserFollowers: builder.query<Follower[], void>({
      query: () => ({
        url: "/getCurrentUserFollowers",
        method: "GET",
      }),
      transformResponse: (res: { data: Follower[]; message: string }) =>
        res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),
    
    toggleMemoryLike: builder.mutation<
      // server returns: { message, result: { isLiked, memory_id, num_likes? } }
      {
        message: string;
        result: { isLiked: boolean; memory_id: string; num_likes?: number };
      },
      { memoryId: string }
    >({
      query: ({ memoryId }) => ({
        url: "/memoryLike",
        method: "POST",
        body: { memory_id: memoryId },
      }),
      transformResponse: (res: {
        message: string;
        result: { isLiked: boolean; memory_id: string; num_likes?: number };
      }) => res,
    }),

    // Bookmark functionality
    toggleBookmark: builder.mutation<BookmarkResponse, { memory_id: string }>({
      query: (body) => ({
        url: "/memorySave",
        method: "POST",
        body,
      }),
      transformResponse: (res: { message: string; result: BookmarkResponse }) => res.result,
      // Invalidate bookmarks cache to refetch data
      async onQueryStarted({ memory_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // After successful bookmark toggle, invalidate the bookmarks cache
          dispatch(
            InteractionApi.util.invalidateTags(['BookmarkedMemory'])
          );
        } catch (error) {
          console.error("Failed to invalidate bookmarks cache:", error);
        }
      },
    }),

    getUserBookmarks: builder.query<BookmarkedMemory[], void>({
      query: () => ({
        url: "/userBookmarks",
        method: "GET",
      }),
      transformResponse: (res: { bookmarks: BookmarkedMemory[]; message: string }) => res.bookmarks,
      keepUnusedDataFor: 0, // Disable caching - always fetch fresh data
      providesTags: ['BookmarkedMemory'],
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
  useToggleMemoryLikeMutation,
  useCancelFollowRequestMutation,
  // bookmark
  useToggleBookmarkMutation,
  useGetUserBookmarksQuery,
} = InteractionApi;
