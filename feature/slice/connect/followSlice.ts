import baseApiSlice from "../baseApi";

const followSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyFollowers: builder.query({
      query: (arg: { query?: any } | Record<string, any> = {}) => ({
        url: "/connections/followers",
        method: "GET",
        params:
          arg && "query" in arg && arg.query !== undefined ? arg.query : arg,
      }),
      providesTags: ["follow"],
    }),
    getMyFollowings: builder.query({
      query: (arg: { query?: any } | Record<string, any> = {}) => ({
        url: "/connections/following",
        method: "GET",
        params:
          arg && "query" in arg && arg.query !== undefined ? arg.query : arg,
      }),
      providesTags: ["follow"],
    }),
    followUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/connections/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["follow", "User"],
    }),
    unfollowUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/connections/${userId}/unfollow`,
        method: "DELETE",
      }),
      invalidatesTags: ["follow", "User"],
    }),
  }),
});

export const {
  useGetMyFollowersQuery,
  useGetMyFollowingsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followSlice;
