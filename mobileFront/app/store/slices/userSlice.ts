import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../core/types/user";

type UserState = User | {};

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserToReducer: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    clearUser: () => {
      return {};
    },

    setUsername: (state, action: PayloadAction<string>) => {
      const s = state as User;  
      return { ...s, username: action.payload } as UserState;
    },

    setBio: (state, action: PayloadAction<string>) => {
      const s = state as User;
      return { ...s, bio: action.payload } as UserState;
    },

    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      const s = state as User;
      return { ...s, ...action.payload } as UserState;
    },
  },
});

export const { addUserToReducer, clearUser, setUsername, setBio, updateProfile } =
  userSlice.actions;

export default userSlice.reducer;
