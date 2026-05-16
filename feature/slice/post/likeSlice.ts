import baseApiSlice from "../baseApi";

export const likeSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLikeList: builder.query({
      query: ({query}) => ({
        url: `/liked-list/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),

    replyLikeList: builder.query({
      query: ({query}) => ({
        url: `/reply-liked-list/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),

    getCommentLikeListByPostId: builder.query({
      query: ({query}) => ({
        url: `/comment-liked-list/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),

    likePost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    postToggleLike: builder.mutation({
      query: ({ postId }) => ({
        url: `/toggle-like/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    commentLikePost: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment-toggle-like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    replyToggleLikeById: builder.mutation({
      query: ({ commentId }) => ({
        url: `/reply-toggle-like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
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
