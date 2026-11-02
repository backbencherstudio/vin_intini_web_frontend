import baseApiSlice from "../baseApi";

const AboutUsSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query({
      query: () => ({
        url: `/pages/about-us`,
        method: "GET",
      }),
    }),
    //privecy-policy
    getPrivecyPolicy: builder.query({
      query: () => ({
        url: `/pages/privacy-policy`,
        method: "GET",
      }),
    }),

    //terms-and-conditions
    getTermsAndConditions: builder.query({
      query: () => ({
        url: `/pages/terms-and-conditions`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useGetAboutUsQuery,

  useGetPrivecyPolicyQuery,

  useGetTermsAndConditionsQuery,
} = AboutUsSlice;
