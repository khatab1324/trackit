import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CloudinarySignatureResponse,
  MemoryInput,
  Memory,
} from "../../../types/memory";

function providesList<R extends { id: string | number }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  console.log("Providing tags for results:", resultsWithIds);

  return resultsWithIds
    ? [
        { type: tagType as any, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType as any, id })),
      ]
    : [{ type: tagType as any, id: "LIST" }];
}

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
  tagTypes: ["Memory", "UserMemory"] as const,

  endpoints: (builder) => ({
    getMemories: builder.query<Memory[], void>({
      query: () => ({
        url: "/getMemories",
        method: "GET",
      }),

      transformResponse: (res: { data: Memory[]; message: string }) => res.data,

      providesTags: (result) => providesList(result, "Memory"),
    }),

    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({
        url: "/memory",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [
        { type: "Memory", id: "LIST" },
        { type: "UserMemory", id: "CURRENT" },
      ],
    }),
    //TODO: make this as query not mutation
    getMemoryById: builder.mutation<Memory, string>({
      query: (id) => ({
        url: `/getMemoryById/${id}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Memory; message: string }) => res.data,
    }),

    getCloudinarySignature: builder.query<CloudinarySignatureResponse, void>({
      query: () => ({
        url: "/cloudinarySignature",
        method: "GET",
      }),
    }),

    getCurrentUserMemories: builder.query<Memory[], void>({
      query: () => ({
        url: "/currentUserMemories",
        method: "GET",
      }),
      transformResponse: (res: { data: Memory[]; message: string }) => res.data,
      providesTags: (result) => providesList(result, "Memory"),
    }),
  }),
});

export const {
  useGetCloudinarySignatureQuery,
  useSaveMemoryMutation,
  useGetCurrentUserMemoriesQuery,
  useGetMemoriesQuery,
  useGetMemoryByIdMutation,
} = MemoryApi;
