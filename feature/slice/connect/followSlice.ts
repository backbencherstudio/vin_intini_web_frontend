import baseApiSlice from "../baseApi";

const followSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyFollowers: builder.query({
      query: () => ({
        url: "/connections/followers",
        method: "GET",
      }),
      providesTags: ["follow"],
    }),
    getMyFollowings: builder.query({
      query: () => ({
        url: "/connections/following",
        method: "GET",
      }),
      providesTags: ["follow"],
    }),
    followUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/connections/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["follow"],
    }),
    unfollowUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/connections/${userId}/unfollow/`,
        method: "DELETE",
      }),
      invalidatesTags: ["follow"],
    }),
  }),
});

export const {
  useGetMyFollowersQuery,
  useGetMyFollowingsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followSlice;
