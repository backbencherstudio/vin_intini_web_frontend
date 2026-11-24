import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UploadStage = "idle" | "uploading" | "processing" | "success" | "error";

export interface PostUploadState {
  active: boolean;
  isMinimized: boolean;
  stage: UploadStage;
  progress: number; // 0 to 100
  loadedBytes: number;
  totalBytes: number;
  fileName: string;
  fileSize: string;
  isVideo: boolean;
  error: string | null;
  successMessage: string | null;
  postExcerpt: string;
}

const initialState: PostUploadState = {
  active: false,
  isMinimized: false,
  stage: "idle",
  progress: 0,
  loadedBytes: 0,
  totalBytes: 0,
  fileName: "",
  fileSize: "",
  isVideo: false,
  error: null,
  successMessage: null,
  postExcerpt: "",
};

const postUploadSlice = createSlice({
  name: "postUpload",
  initialState,
  reducers: {
    startUpload: (
      state,
      action: PayloadAction<{
        fileName?: string;
        fileSize?: string;
        isVideo?: boolean;
        postExcerpt?: string;
        totalBytes?: number;
      }>,
    ) => {
      state.active = true;
      state.isMinimized = false;
      state.stage = "uploading";
      state.progress = 0;
      state.loadedBytes = 0;
      state.totalBytes = action.payload.totalBytes || 0;
      state.fileName = action.payload.fileName || "";
      state.fileSize = action.payload.fileSize || "";
      state.isVideo = action.payload.isVideo ?? false;
      state.postExcerpt = action.payload.postExcerpt || "";
      state.error = null;
      state.successMessage = null;
    },
    updateProgress: (
      state,
      action: PayloadAction<{
        progress: number;
        loadedBytes?: number;
        totalBytes?: number;
      }>,
    ) => {
      state.progress = action.payload.progress;
      if (action.payload.loadedBytes !== undefined) {
        state.loadedBytes = action.payload.loadedBytes;
      }
      if (action.payload.totalBytes !== undefined) {
        state.totalBytes = action.payload.totalBytes;
      }
    },
    setStage: (state, action: PayloadAction<UploadStage>) => {
      state.stage = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.stage = "error";
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.stage = "success";
      state.progress = 100;
      state.successMessage = action.payload;
    },
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
    },
    setIsMinimized: (state, action: PayloadAction<boolean>) => {
      state.isMinimized = action.payload;
    },
    dismissUpload: (state) => {
      state.active = false;
      state.stage = "idle";
      state.progress = 0;
      state.error = null;
      state.successMessage = null;
    },
    resetUpload: () => initialState,
  },
});

export const {
  startUpload,
  updateProgress,
  setStage,
  setError,
  setSuccess,
  toggleMinimize,
  setIsMinimized,
  dismissUpload,
  resetUpload,
} = postUploadSlice.actions;

export default postUploadSlice.reducer;
