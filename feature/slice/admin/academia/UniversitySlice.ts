import baseApiSlice from "../../baseApi";

const universitySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUniversity: builder.query({
      query: (params) => ({
        url: `/admin/academia/universities`,
        method: "GET",
        params,
      }),
      providesTags: ["university"],
    }),

    //change-password
    postChangePassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/change-password",
        method: "POST",
        body: payload,
      }),
    }),

    DeleteAllLoginActivity: builder.mutation({
      query: () => ({
        url: `/security/login-activities/clear-all`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //logout user
    LogoutActiveSessions: builder.mutation({
      query: (id) => ({
        url: `/security/login-activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //
  }),
});

export const {
  useGetUniversityQuery,
  usePostChangePasswordMutation,
  useLogoutActiveSessionsMutation,

  useDeleteAllLoginActivityMutation,
} = universitySlice;
