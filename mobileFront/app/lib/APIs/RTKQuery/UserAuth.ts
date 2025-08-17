import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../core/types/user";
import Config from "react-native-config";
export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    getUserByToken: builder.mutation<{ user: User }, { token: string }>({
      query: (token) => ({
        url: "/getUserByToken",
        method: "POST",
        //TODO :edit this shit
        body: { token: token.token },
      }),
    }),
    getUserById: builder.query<{ user: User }, { userId: string; token: string }>({
      query: ({ userId, token }) => ({
        url: `/getUserById/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    
  }),
});

export const { useGetUserByTokenMutation, useGetUserByIdQuery } = UserApi;
