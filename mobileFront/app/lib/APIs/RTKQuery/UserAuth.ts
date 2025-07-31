import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../../types/user";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://00d6a04b5806.ngrok-free.app",
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
