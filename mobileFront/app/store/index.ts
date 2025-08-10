import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../lib/APIs/RTKQuery/authApi";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import sheardDataThrowAppRedReducer from "./slices/sheardDataSlice";
import { UserApi } from "../lib/APIs/RTKQuery/UserAuth";
import { MemoryApi } from "../lib/APIs/RTKQuery/memoryApi";
import { InteractionApi } from "../lib/APIs/RTKQuery/InteractionApi";

// Create a root reducer that can be reset
const appReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [UserApi.reducerPath]: UserApi.reducer,
  [MemoryApi.reducerPath]: MemoryApi.reducer,
  [InteractionApi.reducerPath]: InteractionApi.reducer,
  sheardDataThrowApp: sheardDataThrowAppRedReducer,
  auth: authReducer,
  user: userReducer,
});

// Root reducer with reset functionality
const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    // Reset all state to initial values
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(UserApi.middleware)
      .concat(MemoryApi.middleware)
      .concat(InteractionApi.middleware),
});

// Action creator for resetting the store
export const resetStore = () => ({ type: 'RESET_STORE' });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
