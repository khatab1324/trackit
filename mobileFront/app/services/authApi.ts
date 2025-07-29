import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://aabb079c1cf3.ngrok-free.app",
  }),
  endpoints: (builder) => ({
    signin: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
    }),

    signup: builder.mutation<
      { message: string },
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
