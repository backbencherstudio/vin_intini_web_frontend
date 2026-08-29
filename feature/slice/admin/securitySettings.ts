import baseApiSlice from "../baseApi";

const securitySettingsSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityOverview: builder.query({
      query: () => ({
        url: `/security/overview`,
        method: "GET",
      }),
    }),

    //change-password
    postChangePassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/change-password",
        method: "POST",
        body: payload,
      }),
    }),

    //activity-session
    getActiveSessions: builder.query({
      query: () => ({
        url: `/security/active-sessions`,
        method: "GET",
      }),
    }),

    //login-activity
  getLoginActivity: builder.query({
  query: (params) => ({
    url: "/security/login-activities",
    method: "GET",
    params,
  }),
  providesTags:["loginActivities"]
}),

    DeleteLoginActivity: builder.mutation({
  query: (id) => ({
    url: `/security/login-activities/${id}`, 
    method: "DELETE",
  }),
  invalidatesTags:["loginActivities"]
}),

//emabele pass
 EnablePassword: builder.mutation({
      query: (payload) => ({
        url: "/2fa/setup",
        method: "POST",
        body: payload,
      }),
    }),

    //code send
     ProviderEmailCode: builder.mutation({
      query: (payload) => ({
        url: "/2fa/confirm",
        method: "POST",
        body: payload,
      }),
    }),

    //desable pass
     DesablePasswd: builder.mutation({
      query: (payload) => ({
        url: "/2fa/disable",
        method: "POST",
        body: payload,
      }),
    }),

  }),
});

export const {
  useGetSecurityOverviewQuery,

  usePostChangePasswordMutation,

  useGetActiveSessionsQuery,
  useDeleteLoginActivityMutation,

  useGetLoginActivityQuery,
  useEnablePasswordMutation,
  useProviderEmailCodeMutation,
  useDesablePasswdMutation
} = securitySettingsSlice;
