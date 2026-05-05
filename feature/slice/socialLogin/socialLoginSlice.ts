import baseApiSlice from "../baseApi";

const socialLoginSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGoogle: builder.query({
      query: () => ({
        url: `/auth/google?platform=web`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetGoogleQuery } = socialLoginSlice;
