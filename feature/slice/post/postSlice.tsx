import baseApiSlice from "../baseApi";

const postSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: (id) => ({
        url: `/posts`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getGroupList: builder.query({
      query: () => ({
        url: `/group-list`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getGroupTimeline: builder.query({
      query: (id) => ({
        url: `/group-posts/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getTimeline: builder.query({
      query: (id) => ({
        url: `/timeline/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getLikeList: builder.query({
      query: (postId) => ({
        url: `/liked-list/${postId}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    replyLikeList: builder.query({
      query: (postId) => ({
        url: `/reply-liked-list/${postId}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getCommentLikeListByPostId: builder.query({
      query: (postId) => ({
        url: `/comment-liked-list/${postId}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getReplyListByCommentId: builder.query({
      query: (commentId) => ({
        url: `/reply-list/${commentId}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getAllCommentListByPostId: builder.query({
      query: (postId) => ({
        url: `/comment-list/${postId}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getNewsfeed: builder.query({
      query: () => ({
        url: `/newsfeed`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getPostProfileById: builder.query({
      query: (id) => ({
        url: `/profile/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getGroupPostByID: builder.query({
      query: ({ id, groupId }) => ({
        url: `/groups/${groupId}/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    likePost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    commentLikePost: builder.mutation({
      query: ({ postData, commentId }) => ({
        url: `/comment-toggle-like/${commentId}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    commentPostById: builder.mutation({
      query: ({ postData, id }) => ({
        url: `/comment/${id}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    replyToggleLikeById: builder.mutation({
      query: ({ postData, commentId }) => ({
        url: `/reply-toggle-like/${commentId}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    updatePost: builder.mutation({
      query: (postData) => ({
        url: `/profile/posts/${postData.id}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    updateGroupPost: builder.mutation({
      query: (postData) => ({
        url: `/groups/${postData.groupId}/posts/${postData.id}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["post"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/profile/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/reply/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
    deleteGroupPost: builder.mutation({
      query: ({ postId, groupId }) => ({
        url: `/groups/${groupId}/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetTimelineQuery,
  useGetGroupListQuery,
  useGetLikeListQuery,
  useReplyLikeListQuery,
  useGetCommentLikeListByPostIdQuery,
  useGetReplyListByCommentIdQuery,
  useGetAllCommentListByPostIdQuery,
  useGetNewsfeedQuery,
  useGetPostProfileByIdQuery,
  useGetGroupPostByIDQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useCommentLikePostMutation,
  useCommentPostByIdMutation,
  useReplyToggleLikeByIdMutation,
  useUpdatePostMutation,
  useUpdateGroupPostMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useDeleteGroupPostMutation,
} = postSlice;
