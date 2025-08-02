import { createSlice } from "@reduxjs/toolkit";
interface ThemeState {
  darkMode: boolean;
}
const initialState: ThemeState = {
  darkMode: false,
};
const sheardDataThrowAppSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});
export const { toggleTheme } = sheardDataThrowAppSlice.actions;
export default sheardDataThrowAppSlice.reducer;
