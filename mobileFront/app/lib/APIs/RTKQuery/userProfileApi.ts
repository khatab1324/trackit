import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../core/types/user";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the store
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    updateUsername: builder.mutation<
      { message: string },
      { username: string }
    >({
      query: (body) => ({
        url: "/user/username",
        method: "PUT",
        body,
      }),
    }),

    updateBio: builder.mutation<
      { message: string },
      { bio: string }
    >({
      query: (body) => ({
        url: "/user/bio",
        method: "PUT",
        body,
      }),
    }),

    updatePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/user/password",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { 
  useUpdateUsernameMutation, 
  useUpdateBioMutation, 
  useUpdatePasswordMutation 
} = userProfileApi; 