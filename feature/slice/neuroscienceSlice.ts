import baseApiSlice from "./baseApi";

const neuroscienceSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNeuroscienceBiotechnology: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/biotech`,
        method: "GET",
      }),
      providesTags: ["neuroscience"],
    }),
    getNeuroscienceBiotechnologyPartners: builder.query({
      query: ({ query }) => ({
        url: `neuroscience-network/industry/biotech-partners`,
        method: "GET",
      }),
      providesTags: ["neuroscience"],
    }),
    getNeuroscienceOne: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pharma`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
    getNeuroscienceOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pharma-partners`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
    getNeurosciencePublicationsOne: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/publications`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
    getNeurosciencePublicationsOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pub-partners`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
  }),
});

export const {
  useGetNeuroscienceBiotechnologyQuery,
  useGetNeuroscienceBiotechnologyPartnersQuery,
  useGetNeurosciencePublicationsOneQuery,
  useGetNeurosciencePublicationsOnePartnersQuery,
  useGetNeuroscienceOneQuery,
  useGetNeuroscienceOnePartnersQuery,
} = neuroscienceSlice;
