import baseApiSlice from "../baseApi";

export const likeSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLikeList: builder.query({
      query: (postId) => ({
        url: `/liked-list/${postId}`,
      }),
      providesTags: ["Post", "Like"],
    }),

    replyLikeList: builder.query({
      query: (commentId) => ({
        url: `/reply-liked-list/${commentId}`,
      }),
      providesTags: ["Post", "Like"],
    }),

    getCommentLikeListByPostId: builder.query({
      query: (postId) => ({
        url: `/comment-liked-list/${postId}`,
      }),
      providesTags: ["Post", "Like"],
    }),

    likePost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Like", "Post"],
    }),

    postToggleLike: builder.mutation({
      query: ({ postId }) => ({
        url: `/toggle-like/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Like", "Post"],
    }),

    commentLikePost: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment-toggle-like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    replyToggleLikeById: builder.mutation({
      query: ({ postData, commentId }) => ({
        url: `/reply-toggle-like/${commentId}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post", "Like"],
    }),
  }),
});

export const {
  useGetLikeListQuery,
  useReplyLikeListQuery,
  useGetCommentLikeListByPostIdQuery,
  useLikePostMutation,
  usePostToggleLikeMutation,
  useCommentLikePostMutation,
  useReplyToggleLikeByIdMutation,
} = likeSlice;
