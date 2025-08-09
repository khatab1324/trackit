import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UIMemory = {
  id: string;
  content_url: string;
  title?: string;
  description?: string;
  num_likes?: number;
  num_comments?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  userInfo?: { username?: string };
};

type ViewerState = {
  viewerMemories: UIMemory[];
};

const initialState: ViewerState = {
  viewerMemories: [],
};

const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {
    setViewerMemories(state, action: PayloadAction<UIMemory[]>) {
      state.viewerMemories = action.payload;
    },
    patchOneInViewer(
      state,
      action: PayloadAction<Partial<UIMemory> & { id: string }>
    ) {
      const i = state.viewerMemories.findIndex(m => m.id === action.payload.id);
      if (i !== -1) state.viewerMemories[i] = { ...state.viewerMemories[i], ...action.payload };
    },
    clearViewerMemories(state) {
      state.viewerMemories = [];
    },
  },
});

export const { setViewerMemories, patchOneInViewer, clearViewerMemories } = memorySlice.actions;
export default memorySlice.reducer;
