import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../lib/APIs/RTKQuery/authApi";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import sheardDataThrowAppRedReducer from "./slices/sheardDataSlice";
import { UserApi } from "../lib/APIs/RTKQuery/UserAuth";
import { MemoryApi } from "../lib/APIs/RTKQuery/memoryApi";
import { InteractionApi } from "../lib/APIs/RTKQuery/InteractionApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [MemoryApi.reducerPath]: MemoryApi.reducer,
    [InteractionApi.reducerPath]: InteractionApi.reducer,
    sheardDataThrowApp: sheardDataThrowAppRedReducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(UserApi.middleware)
      .concat(MemoryApi.middleware)
      .concat(InteractionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
