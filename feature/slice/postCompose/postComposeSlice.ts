import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PostType = "Post_write" | "post_access" | "post_group";
export type PostVisibility = "anyone" | "connections" | "group";
export type CommentControl = "anyone" | "connections" | "no_one";

interface PostComposeState {
  postType: PostType;
  postVisibility: PostVisibility;
  commentControl: CommentControl;
  selectedGroupIds: number[];
}

const initialState: PostComposeState = {
  postType: "Post_write",
  postVisibility: "anyone",
  commentControl: "anyone",
  selectedGroupIds: [2, 3, 6],
};

const postComposeSlice = createSlice({
  name: "postCompose",
  initialState,
  reducers: {
    setPostType: (state, action: PayloadAction<PostType>) => {
      state.postType = action.payload;
    },
    setPostVisibility: (state, action: PayloadAction<PostVisibility>) => {
      state.postVisibility = action.payload;
    },
    setCommentControl: (state, action: PayloadAction<CommentControl>) => {
      state.commentControl = action.payload;
    },
    toggleSelectedGroupId: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedGroupIds.includes(id)) {
        state.selectedGroupIds = state.selectedGroupIds.filter(
          (groupId) => groupId !== id,
        );
      } else {
        state.selectedGroupIds.push(id);
      }
    },
    resetPostComposeState: () => initialState,
  },
});

export const {
  setPostType,
  setPostVisibility,
  setCommentControl,
  toggleSelectedGroupId,
  resetPostComposeState,
} = postComposeSlice.actions;

export default postComposeSlice.reducer;
