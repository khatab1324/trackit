import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
      if (token) headers.set("authorization", `bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Memory", "Comments"],
  endpoints: (builder) => ({
    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({ url: "/memory", method: "POST", body }),
    }),

    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, void>({
      query: () => ({ url: "/cloudinarySignature", method: "GET" }),
    }),

    getCurrentUserMemories: builder.mutation<Memory[], void>({
      query: () => ({ url: "/currentUserMemories", method: "GET" }),
    }),

    getNearMemories: builder.mutation<Memory[], { lat: string; lng: string }>(
      {
        query: ({ lat, lng }) => ({
          url: `/memories/near?lat=${lat}&lng=${lng}`,
          method: "GET",
        }),
      }
    ),

    getMemoryById: builder.query<Memory, string>({
      query: (memoryId) => ({ url: `/memory/${memoryId}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Memory", id }],
    }),

    toggleLike: builder.mutation<
      { liked: boolean; likesCount?: number },
      { memoryId: string }
    >({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { memoryId }) => [{ type: "Memory", id: memoryId }],
    }),

    toggleSave: builder.mutation<
      { saved: boolean; savesCount?: number },
      { memoryId: string }
    >({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/save`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { memoryId }) => [{ type: "Memory", id: memoryId }],
    }),

    getComments: builder.query<{ comments: any[] }, { memoryId: string }>({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/comments`,
        method: "GET",
      }),
      providesTags: (_r, _e, { memoryId }) => [{ type: "Comments", id: memoryId }],
    }),
  }),
});

export const {
  useGetCloudinarySignatureMutation,
  useSaveMemoryMutation,
  useGetCurrentUserMemoriesMutation,
  useGetNearMemoriesMutation,
  useGetMemoryByIdQuery,
  useToggleLikeMutation,
  useToggleSaveMutation,
  useGetCommentsQuery,
} = MemoryApi;
