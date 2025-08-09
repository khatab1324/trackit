import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coords } from "../../core/types/memory";
interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState & { location: Coords | null } = {
  darkMode: false,
  location: null,
};

export const sheardDataThrowAppSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLocation(state, action: PayloadAction<Coords>) {
      state.location = action.payload;
    },
  },
});

export const { toggleTheme, setLocation } = sheardDataThrowAppSlice.actions;
export default sheardDataThrowAppSlice.reducer;
