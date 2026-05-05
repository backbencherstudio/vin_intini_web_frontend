import baseApiSlice from "../baseApi";

export const postApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getPost: builder.query({
      query: () => ({ url: "/posts", method: "GET" }),
      providesTags: ["Post"],
    }),

    getGroupList: builder.query({
      query: () => ({ url: "/group-list", method: "GET" }),
      providesTags: ["Post"],
    }),

    getGroupTimeline: builder.query({
      query: (id) => ({ url: `/group-posts/${id}` }),
      providesTags: ["Post"],
    }),

    getProfileTimeline: builder.query({
      query: (id) => ({ url: `/timeline/${id}` }),
      providesTags: ["Post"],
    }),

    getNewsfeed: builder.query({
      query: () => ({ url: "/newsfeed" }),
      providesTags: ["Post"],
    }),

    getPostProfileById: builder.query({
      query: (id) => ({ url: `/profile/posts/${id}` }),
      providesTags: ["Post"],
    }),

    getGroupPostByID: builder.query({
      query: ({ id, groupId }) => ({
        url: `/groups/${groupId}/posts/${id}`,
      }),
      providesTags: ["Post"],
    }),

    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    updatePost: builder.mutation({
      query: (postData) => ({
        url: `/profile/posts/${postData.id}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    updateGroupPost: builder.mutation({
      query: (postData) => ({
        url: `/groups/${postData.groupId}/posts/${postData.id}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/profile/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    deleteGroupPost: builder.mutation({
      query: ({ postId, groupId }) => ({
        url: `/groups/${groupId}/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetProfileTimelineQuery,
  useGetGroupListQuery,
  useGetNewsfeedQuery,
  useGetPostProfileByIdQuery,
  useGetGroupPostByIDQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useUpdateGroupPostMutation,
  useDeletePostMutation,
  useDeleteGroupPostMutation,
} = postApi;
