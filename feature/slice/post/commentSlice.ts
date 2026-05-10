import baseApiSlice from "../baseApi";

export const commentApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllCommentListByPostId: builder.query({
      query: (postId) => ({
        url: `/comment-list/${postId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),

    getReplyListByCommentId: builder.query({
      query: (commentId) => ({
        url: `/reply-list/${commentId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    getMyCommentList: builder.query({
      query: () => ({
        url: `/my-comment-list`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),

    commentPostById: builder.mutation({
      query: ({ postData, postId }) => ({
        url: `/comment/${postId}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/reply/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetAllCommentListByPostIdQuery,
  useGetMyCommentListQuery,
  useGetReplyListByCommentIdQuery,
  useCommentPostByIdMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
} = commentApi;
