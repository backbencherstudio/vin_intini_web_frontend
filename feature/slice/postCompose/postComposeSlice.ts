import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PostType = "Post_write" | "post_access" | "post_group";
export type PostVisibility = "public" | "connections" | "group";
export type CommentControl = "anyone" | "connections" | "no_one";

interface PostComposeState {
  postType: PostType;
  postText: string;
  postVisibility: PostVisibility;
  commentControl: CommentControl;
  selectedGroupIds: number[];
}

const initialState: PostComposeState = {
  postType: "Post_write",
  postText: "",
  postVisibility: "public",
  commentControl: "anyone",
  selectedGroupIds: [],
};

const postComposeSlice = createSlice({
  name: "postCompose",
  initialState,
  reducers: {
    setPostType: (state, action: PayloadAction<PostType>) => {
      state.postType = action.payload;
    },
    setPostText: (state, action: PayloadAction<string>) => {
      state.postText = action.payload;
    },
    setPostVisibility: (state, action: PayloadAction<PostVisibility>) => {
      state.postVisibility = action.payload;
    },
    setCommentControl: (state, action: PayloadAction<CommentControl>) => {
      state.commentControl = action.payload;
    },
    setSelectedGroupIds: (state, action: PayloadAction<number[]>) => {
      state.selectedGroupIds = action.payload;
    },
    resetPostComposeState: () => initialState,
  },
});

export const {
  setPostType,
  setPostText,
  setPostVisibility,
  setCommentControl,
  setSelectedGroupIds,
  resetPostComposeState,
} = postComposeSlice.actions;

export default postComposeSlice.reducer;
