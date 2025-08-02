import {
  createApi,
  fetchBaseQuery,
  RootState,
} from "@reduxjs/toolkit/query/react";
import { User } from "../../../types/user";
import {
  CloudinarySignatureResponse,
  MemoryInput,
} from "../../../types/memory";

export const MemoryApi = createApi({
  reducerPath: "MemoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      //TODO : fix the any and put instad RootState
      const token = (getState() as any).auth.token;

      if (token) {
        headers.set("authorization", `bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // TODO: the response will get back have {message}|{error} not void
    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({ url: "/memory", method: "POST", body }),
    }),
    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, void>(
      {
        query: () => ({
          url: "/cloudinarySignature",
          method: "GET",
        }),
      }
    ),
  }),
});

export const { useGetCloudinarySignatureMutation, useSaveMemoryMutation } =
  MemoryApi;
