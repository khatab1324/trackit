import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../types/user";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://6442d6a0d47d.ngrok-free.app",
  }),
  endpoints: (builder) => ({
    getUserByToken: builder.mutation<{ user: User }, { token: string }>({
      query: (token) => ({
        url: "/getUserByToken",
        method: "POST",
        //TODO :edit this shit
        body: { token: token.token },
      }),
    }),
  }),
});

export const { useGetUserByTokenMutation } = UserApi;
