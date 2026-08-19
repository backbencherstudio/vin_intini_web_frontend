import baseApiSlice from "../baseApi";

const userSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/me",
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
    getProfileById: builder.query({
      query: (id) => ({
        url: `/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["User", "connect", "follow"],
    }),
    profileSetup: builder.mutation({
      query: (payload) => ({
        url: "/setup-profile",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    profileAboutUpdate: builder.mutation({
      query: (payload) => ({
        url: "/profile/update",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    profileImageUpdate: builder.mutation({
      query: (payload) => ({
        url: "/profile/images",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetMyProfileQuery,
  useGetInstitutionQuery,
  useGetProfileByIdQuery,
  useProfileSetupMutation,
  useProfileAboutUpdateMutation,
  useProfileImageUpdateMutation,
} = userSlice;
