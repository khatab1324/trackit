import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../store";

export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPTED";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  actor: { user_id: string; username: string; avatar_url?: string };
  memo?: { id: string; content_url?: string };
  comment_text?: string;
  is_read: boolean;
  createdAt: string; // ISO
};

export type NotificationsResponse = {
  data: NotificationItem[];
  unreadCount: number;
  nextCursor?: string | null;
};

export const NotificationsApi = createApi({
  reducerPath: "NotificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/notifications",
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    markRead: builder.mutation<{ ok: true }, { ids?: string[] | "all" }>({
      query: (body) => ({ url: "/notifications/mark-read", method: "POST", body }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    acceptFollow: builder.mutation<{ ok: true }, { user_id: string }>({
      query: (body) => ({ url: "/follow/accept", method: "POST", body }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    rejectFollow: builder.mutation<{ ok: true }, { user_id: string }>({
      query: (body) => ({ url: "/follow/reject", method: "POST", body }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useAcceptFollowMutation,
  useRejectFollowMutation,
} = NotificationsApi;
