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
    registration: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
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
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useRegVerifyOtpMutation,
  useRegistrationMutation,
  useResetPasswordMutation,
} = authSlice;
