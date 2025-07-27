import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
const initialState: User | object = {};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserToReducer: (state, action) => {
      state: action.payload.user as User;
    },
  },
});

export const { addUserToReducer } = userSlice.actions;
export default userSlice.reducer;
