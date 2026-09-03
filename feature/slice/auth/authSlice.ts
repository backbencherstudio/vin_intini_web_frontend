import baseApiSlice from "../baseApi";

const authSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    registration: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<unknown, void>({
      query: () => ({
        url: "/refresh",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/send-otp",
        method: "POST",
        body: { email },
      }),
    }),
    regSendOTP: builder.mutation({
      query: (email) => ({
        url: "/register/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    regVerifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/register/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    contactSubmit: builder.mutation({
      query: ({ payload }) => ({
        url: "/contact-submit",
        method: "POST",
        body: payload,
      }),
    }),
    recoverYourAccount: builder.mutation({
      query: (payload) => ({
        url: "/account/restore",
        method: "POST",
        body: payload,
      }),
    }),
    deleteYourAccount: builder.mutation({
      query: (payload) => ({
        url: "/account/delete-request",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, new_password, new_password_confirmation }) => ({
        url: "/password-reset",
        method: "POST",
        body: { email, new_password, new_password_confirmation },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useRegVerifyOtpMutation,
  useRegistrationMutation,
  useRegSendOTPMutation,
  useResetPasswordMutation,
  useRecoverYourAccountMutation,
  useContactSubmitMutation,
  useDeleteYourAccountMutation,
} = authSlice;
