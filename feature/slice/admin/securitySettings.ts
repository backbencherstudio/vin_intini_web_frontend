import baseApiSlice from "../baseApi";

const securitySettingsSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityOverview: builder.query({
      query: () => ({
        url: `/security/overview`,
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

    //change-password
    postChangePassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/change-password",
        method: "POST",
        body: payload,
      }),
    }),
    postAdminChangePassword: builder.mutation({
      query: (payload) => ({
        url: "/admin/update-password",
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
      providesTags: ["activeSessions"],
    }),

    //delete active session (revoke)
    DeleteActiveSessions: builder.mutation({
      query: (id) => ({
        url: `/security/sessions/revoke/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["activeSessions", "loginActivities"],
    }),

    //Delete all sessions
    DeletAllSessions: builder.mutation({
      query: () => ({
        url: "/security/sessions/sign-out-all",
        method: "POST",
      }),
      invalidatesTags: ["activeSessions", "loginActivities"],
    }),

    //login-activity
    getLoginActivity: builder.query({
      query: (params) => ({
        url: "/security/login-activities",
        method: "GET",
        params,
      }),
      providesTags: ["loginActivities"],
    }),

    //delete all activity
    DeleteAllLoginActivity: builder.mutation({
      query: () => ({
        url: `/security/login-activities/clear-all`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //delete single login activity
    DeleteLoginActivity: builder.mutation({
      query: (id) => ({
        url: `/security/login-activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //revoke session (sign out session)
    LogoutActiveSessions: builder.mutation({
      query: (id) => ({
        url: `/security/sessions/revoke/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["activeSessions", "loginActivities"],
    }),

    //suspicious activities
    getSuspiciousActivities: builder.query({
      query: () => ({
        url: "/security/suspicious-activities-list",
        method: "GET",
      }),
      providesTags: ["loginActivities"],
    }),

    //resolve all suspicious activities
    resolveAllActivities: builder.mutation({
      query: () => ({
        url: "/security/resolve-all",
        method: "POST",
      }),
      invalidatesTags: ["loginActivities", "overview"],
    }),

    //emabele pass
    EnablePassword: builder.mutation({
      query: (payload) => ({
        url: "/2fa/setup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //code send
    ProviderEmailCode: builder.mutation({
      query: (payload) => ({
        url: "/2fa/confirm",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),
    // code verify ===
    twoFactorEmailCodeVerify: builder.mutation({
      query: (payload) => ({
        url: "/2fa/verify-login",
        method: "POST",
        body: payload,
      }),
    }),
    // code verify ===
    twoFactorRecoveryEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-init",
        method: "POST",
        body: payload,
      }),
    }),
    twoFactorRecoveryCodeSentEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-send-otp",
        method: "POST",
        body: payload,
      }),
    }),
    twoFactorRecoveryCodeVerifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-verify",
        method: "POST",
        body: payload,
      }),
    }),
    generateTwoFactorRecoveryCodeEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery/resend-otp",
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
      invalidatesTags: ["overview"],
    }),

    //newGenerate Code
    GenerateCode: builder.mutation({
      query: (payload) => ({
        url: "/2fa/regenerate-codes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //email recovery add
    RecoveryEmailUpdate: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-email/update",
        method: "POST",
        body: payload,
      }),
    }),

    //email recovery otp verify
    RecoveryEmailOtpVerify: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-email/confirm",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),
    ResendRecoveryEmailOtp: builder.mutation({
      query: () => ({
        url: "/2fa/recovery-email/resend-otp",
        method: "POST",
      }),
    }),

    //singele trusted session
    SingeleSessionTrusted: builder.mutation({
      query: (id) => ({
        url: `/security/resolve/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    SecureAccountFromLoginActivity: builder.mutation({
      query: (id) => ({
        url: `/security/secure-account/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["loginActivities", "activeSessions", "overview"],
    }),

    //
  }),
});

export const {
  useGetSecurityOverviewQuery,
  usePostChangePasswordMutation,
  usePostAdminChangePasswordMutation,
  useGetActiveSessionsQuery,
  useDeleteActiveSessionsMutation,
  useDeletAllSessionsMutation,
  useDeleteLoginActivityMutation,
  useGetLoginActivityQuery,
  useLogoutActiveSessionsMutation,
  useEnablePasswordMutation,
  useDeleteAllLoginActivityMutation,
  useProviderEmailCodeMutation,
  useTwoFactorEmailCodeVerifyMutation,
  useTwoFactorRecoveryEmailMutation,
  useTwoFactorRecoveryCodeSentEmailMutation,
  useTwoFactorRecoveryCodeVerifyEmailMutation,
  useGenerateTwoFactorRecoveryCodeEmailMutation,
  useDesablePasswdMutation,
  useGenerateCodeMutation,

  useRecoveryEmailOtpVerifyMutation,
  useRecoveryEmailUpdateMutation,
  useResendRecoveryEmailOtpMutation,
  useSingeleSessionTrustedMutation,
  useSecureAccountFromLoginActivityMutation,
  useGetSuspiciousActivitiesQuery,
  useResolveAllActivitiesMutation,
} = securitySettingsSlice;

export const useDeleteAllSessionsMutation = useDeletAllSessionsMutation;
export const useDisablePasswdMutation = useDesablePasswdMutation;
export const useSingleSessionTrustedMutation = useSingeleSessionTrustedMutation;
