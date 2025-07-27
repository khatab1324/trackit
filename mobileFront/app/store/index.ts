import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { UserApi } from "../lib/APIs/RTKQuery/UserAuth";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer, // Add UserApi reducer
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(UserApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
