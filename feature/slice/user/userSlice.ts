import baseApiSlice from "../baseApi";

const userSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getInstitution: builder.query({
      query: () => ({
        url: "/institution-suggestions",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    profileSetup: builder.mutation({
      query: (payload) => ({
        url: "/setup-profile",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetInstitutionQuery,
  useProfileSetupMutation,
} = userSlice;
