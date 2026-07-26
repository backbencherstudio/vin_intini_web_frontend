import baseApiSlice from "../baseApi";

const AboutUsSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query({
      query: () => ({
        url: `/pages/about-us`,
        method: "GET",
      }),
    }),
    getAcademiaByState: builder.query({
      query: (id) => ({
        url: `/states/${id}`,
        method: "GET",
      }),
    }),
   
  }),
});

export const {
  useGetAboutUsQuery,

  useGetAcademiaByStateQuery,

} = AboutUsSlice;
