import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "../lib/APIs/RTKQuery/authApi";
import { UserApi } from "../lib/APIs/RTKQuery/UserAuth";
import { MemoryApi } from "../lib/APIs/RTKQuery/memoryApi";
import { InteractionApi } from "../lib/APIs/RTKQuery/InteractionApi";
import { NotificationsApi } from "../lib/APIs/RTKQuery/notificationsApi";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import sheardDataThrowAppRedReducer from "./slices/sheardDataSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [MemoryApi.reducerPath]: MemoryApi.reducer,
    [InteractionApi.reducerPath]: InteractionApi.reducer,
    [NotificationsApi.reducerPath]: NotificationsApi.reducer,

    sheardDataThrowApp: sheardDataThrowAppRedReducer,
    auth: authReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(UserApi.middleware)
      .concat(MemoryApi.middleware)
      .concat(InteractionApi.middleware)
      .concat(NotificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
