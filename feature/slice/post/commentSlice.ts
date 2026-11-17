import baseApiSlice from "../baseApi";

export const commentApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommentListByPostId: builder.query({
      // Supports both legacy call `query(postId)` and object call `query({ postId, query })`.
      query: ({ query }) => {
        return {
          url: `/comment-list/${query}`,
          method: "GET",
        };
      },
      providesTags: ["Comment"],
    }),

    getReplyListByCommentId: builder.query({
      query: (arg) => {
        if (typeof arg === "object" && arg !== null) {
          const { commentId, targetReplyId } = arg;
          const queryParam = targetReplyId ? `?target_reply_id=${targetReplyId}` : "";
          return {
            url: `/reply-list/${commentId}${queryParam}`,
            method: "GET",
          };
        }
        return {
          url: `/reply-list/${arg}`,
          method: "GET",
        };
      },
      providesTags: ["Comment"],
    }),
    checkCommentTarget: builder.query({
      query: (params) => ({
        url: `/comment-target-status`,
        method: "GET",
        params,
      }),
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
  useCheckCommentTargetQuery,
  useCommentPostByIdMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
} = commentApi;
