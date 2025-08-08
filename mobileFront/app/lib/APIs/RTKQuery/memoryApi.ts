import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CloudinarySignatureResponse,
  MemoryInput,
  Memory,
} from "../../../types/memory";

// تعريف الـ API
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
  tagTypes: ["Memory", "Comments"], // ⬅️ مهم للتحديث التلقائي بعد اللايك والحفظ

  endpoints: (builder) => ({
    // حفظ ميموري جديد
    saveMemory: builder.mutation<void, MemoryInput>({
      query: (body) => ({
        url: "/memory",
        method: "POST",
        body,
      }),
    }),

    // جلب توقيع Cloudinary
    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, void>({
      query: () => ({
        url: "/cloudinarySignature",
        method: "GET",
      }),
    }),

    // جلب ذكريات المستخدم الحالي
    getCurrentUserMemories: builder.mutation<Memory[], void>({
      query: () => ({
        url: "/currentUserMemories",
        method: "GET",
      }),
    }),

    // ===== جديد: جلب تفاصيل ميموري بالـ ID =====
    getMemoryById: builder.query<Memory, string>({
      query: (memoryId) => ({
        url: `/memory/${memoryId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Memory", id }],
    }),

    // ===== جديد: لايك / إلغاء لايك =====
    toggleLike: builder.mutation<
      { liked: boolean; likesCount?: number },
      { memoryId: string }
    >({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { memoryId }) => [
        { type: "Memory", id: memoryId },
      ],
    }),

    // ===== جديد: حفظ / إلغاء حفظ =====
    toggleSave: builder.mutation<{ saved: boolean }, { memoryId: string }>({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/save`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { memoryId }) => [
        { type: "Memory", id: memoryId },
      ],
    }),

    // ===== جديد: جلب التعليقات =====
    getComments: builder.query<{ comments: any[] }, { memoryId: string }>({
      query: ({ memoryId }) => ({
        url: `/memory/${memoryId}/comments`,
        method: "GET",
      }),
      providesTags: (_res, _err, { memoryId }) => [
        { type: "Comments", id: memoryId },
      ],
    }),
  }),
});

// الهوكات الجاهزة للاستخدام
export const {
  useGetCloudinarySignatureMutation,
  useSaveMemoryMutation,
  useGetCurrentUserMemoriesMutation,
  useGetMemoryByIdQuery,
  useToggleLikeMutation,
  useToggleSaveMutation,
  useGetCommentsQuery,
} = MemoryApi;
