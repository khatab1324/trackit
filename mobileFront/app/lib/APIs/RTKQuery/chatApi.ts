import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type ChatMessage = {
  id: string;
  message: string;
  sender_id: string;
  create_at: string;
  media_link?: string | null;
  chat_id: string;
};

type Chat = {
  id: string;
  participants: any[];
};

type ChatResponse = {
  message: string;
  data: {
    chat: Chat;
    conversation: ChatMessage[];
    isNew: boolean;
  };
};
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  
  endpoints: (builder) => ({
    getFriendChat: builder.query<ChatResponse, string>({
      query: (friendId) => ({
        url: `/getChat/${friendId}`,
        method: "GET",
      }),
      transformResponse: (response: ChatResponse) => response,

    }),
  }),
});

export const { useGetFriendChatQuery } = chatApi;
