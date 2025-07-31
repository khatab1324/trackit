import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Memory {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryState {
  memories: Memory[];
  currentMemory: Memory | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
}

const initialState: MemoryState = {
  memories: [],
  currentMemory: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,
};

const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {
    addMemory: (state, action: PayloadAction<Memory>) => {
      state.memories.unshift(action.payload); // Add to beginning
    },

    setMemories: (state, action: PayloadAction<Memory[]>) => {
      state.memories = action.payload;
    },

    updateMemory: (state, action: PayloadAction<Memory>) => {
      const index = state.memories.findIndex(
        (memory) => memory.id === action.payload.id
      );
      if (index !== -1) {
        state.memories[index] = action.payload;
      }
    },

    deleteMemory: (state, action: PayloadAction<string>) => {
      state.memories = state.memories.filter(
        (memory) => memory.id !== action.payload
      );
    },

    setCurrentMemory: (state, action: PayloadAction<Memory | null>) => {
      state.currentMemory = action.payload;
    },

    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },

    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },

    clearMemories: (state) => {
      state.memories = [];
    },

    clearError: (state) => {
      state.error = null;
    },

    resetUploadState: (state) => {
      state.isUploading = false;
      state.uploadProgress = 0;
    },
  },
});

export const {
  addMemory,
  setMemories,
  updateMemory,
  deleteMemory,
  setCurrentMemory,
  setIsUploading,
  setUploadProgress,
  clearMemories,
  clearError,
  resetUploadState,
} = memorySlice.actions;

export default memorySlice.reducer;
