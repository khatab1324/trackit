import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CloudinarySignatureResponse,
  MemoryInput,
  Memory,
} from "../../../core/types/memory";

export const MemoryApi = createApi({
  reducerPath: "MemoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getMemories: builder.query<Memory[], void>({
      query: () => ({
        url: "/getMemories",
        method: "GET",
      }),
      transformResponse: (res: { data: Memory[]; message: string }) => res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),

    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({
        url: "/memory",
        method: "POST",
        body,
      }),
    }),
    
    getMemoryById: builder.mutation<Memory, string>({
      query: (id) => ({
        url: `/getMemoryById/${id}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Memory; message: string }) => res.data,
    }),

    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, void>(
      {
        query: () => ({
          url: "/cloudinarySignature",
          method: "GET",
        }),
      }
    ),

    getCurrentUserMemories: builder.query<Memory[], void>({
      query: () => ({
        url: "/currentUserMemories",
        method: "GET",
      }),
      transformResponse: (res: { data: Memory[]; message: string }) => res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),
    
    getNearMemory: builder.query<
      Memory[],
      {
        location: {
          lang: number;
          long: number;
        };
      }
    >({
      query: (body) => ({
        url: "/getNearMemroyMemo",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: Memory[]; message: string }) => res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),

    getUserFriendsMemories: builder.query<Memory[], void>({
      query: (userId) => ({
        url: `/getUserFriendsMemories/`,
        method: "GET",
      }),
      transformResponse: (res: { data: Memory[]; message: string }) => res.data,
      keepUnusedDataFor: 0, // Disable caching
    }),
  }),
});

export const {
  useGetMemoriesQuery,
  useSaveMemoryMutation,
  useGetMemoryByIdMutation,
  useGetCloudinarySignatureMutation,
  useGetCurrentUserMemoriesQuery,
  useGetNearMemoryQuery,
  useGetUserFriendsMemoriesQuery,
} = MemoryApi;
