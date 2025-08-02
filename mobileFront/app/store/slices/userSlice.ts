import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";

const initialState: User | {} = {};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserToReducer: (state, action: PayloadAction<User>) => {
      // state.user = action.payload;
      return action.payload;
    },
  },
});

export const { addUserToReducer } = userSlice.actions;
export default userSlice.reducer;
