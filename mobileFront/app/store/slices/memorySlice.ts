import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UIMemory = {
  id: string;                 
  _id?: string;              
  content_url: string;
  title?: string;
  description?: string;
  num_likes?: number;
  num_comments?: number;
  num_saves?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  userInfo?: { username?: string };
  user?: { username?: string };
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
    setViewerMemories(state, action: PayloadAction<UIMemory[] | any[]>) {
      state.viewerMemories = (action.payload as any[]).map((m) => ({
        ...m,
        id: m.id ?? m._id, 
      }));
    },

    patchOneInViewer(
      state,
      action: PayloadAction<Partial<UIMemory> & { id: string }>
    ) {
      const { id, ...patch } = action.payload;
      const idx = state.viewerMemories.findIndex((m) => m.id === id);
      if (idx !== -1) {
        state.viewerMemories[idx] = {
          ...state.viewerMemories[idx],
          ...patch,
        };
      }
    },

    clearViewerMemories(state) {
      state.viewerMemories = [];
    },
  },
});

export const {
  setViewerMemories,
  patchOneInViewer,
  clearViewerMemories,
} = memorySlice.actions;

export default memorySlice.reducer;
