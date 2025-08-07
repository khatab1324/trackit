import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../types/user";
import {
  CloudinarySignatureResponse,
  MemoryInput,
  Memory,
} from "../../../types/memory";

export const MemoryApi = createApi({
  reducerPath: "MemoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({
        url: "/memory",
        method: "POST",
        body,
      }),
    }),

    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, void>(
      {
        query: () => ({
          url: "/cloudinarySignature",
          method: "GET",
        }),
      }
    ),

    getCurrentUserMemories: builder.mutation<Memory[], void>({
      query: () => ({
        url: "/currentUserMemories",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCloudinarySignatureMutation,
  useSaveMemoryMutation,
  useGetCurrentUserMemoriesMutation,
} = MemoryApi;
