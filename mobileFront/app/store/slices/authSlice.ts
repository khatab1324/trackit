import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
  },
});
export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
