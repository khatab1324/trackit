import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../types/user";
import { CloudinarySignatureResponse } from "../../../types/memory";
import Config from "react-native-config";

export const MemoryApi = createApi({
  reducerPath: "MemoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
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

export const { useGetCloudinarySignatureMutation } = MemoryApi;
