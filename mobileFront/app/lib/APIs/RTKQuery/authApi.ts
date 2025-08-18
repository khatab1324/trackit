import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../core/types/user";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
  }),

  endpoints: (builder) => ({
    signin: builder.mutation<
      { message: string; data: { token: string; user: User } },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
    }),

    signup: builder.mutation<
      { message: string; data: { createdUser: User; message: string } },
      { username: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSigninMutation, useSignupMutation } = authApi;
