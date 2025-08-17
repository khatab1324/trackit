import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../lib/APIs/RTKQuery/authApi";
import { UserApi } from "../lib/APIs/RTKQuery/UserAuth";
import { MemoryApi } from "../lib/APIs/RTKQuery/memoryApi";
import { InteractionApi } from "../lib/APIs/RTKQuery/InteractionApi";
import { NotificationsApi } from "../lib/APIs/RTKQuery/notificationsApi";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import sheardDataThrowAppRedReducer from "./slices/sheardDataSlice";
import notificationsReducer from "./slices/notificationsSlice";
import themeReducer from "./slices/themeSlice";
import { chatApi } from "../lib/APIs/RTKQuery/chatApi";

const appReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [UserApi.reducerPath]: UserApi.reducer,
  [MemoryApi.reducerPath]: MemoryApi.reducer,
  [InteractionApi.reducerPath]: InteractionApi.reducer,
  [NotificationsApi.reducerPath]: NotificationsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  sheardDataThrowApp: sheardDataThrowAppRedReducer,
  auth: authReducer,
  user: userReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

const errorHandlingMiddleware =
  (store: any) => (next: any) => (action: any) => {
    try {
      const result = next(action);

      // Log any RTK Query errors
      if (action.type && action.type.includes("/rejected")) {
        console.error("RTK Query error:", action.error);
      }

      return result;
    } catch (error) {
      console.error("Store middleware error:", error);
      throw error;
    }
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    })
      .concat(errorHandlingMiddleware)
      .concat(authApi.middleware)
      .concat(UserApi.middleware)
      .concat(MemoryApi.middleware)
      .concat(InteractionApi.middleware)
      .concat(NotificationsApi.middleware)
      .concat(chatApi.middleware),
});

export const resetStore = () => ({ type: "RESET_STORE" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
