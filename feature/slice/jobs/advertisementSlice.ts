import baseApiSlice from "../baseApi";

const advertisementSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisementDashboard: builder.query({
      query: () => {
        return {
          url: "/industry/advertisements/dashboard",
          method: "GET",
        };
      },
    }),
    getAdvertisementData: builder.query({
      query: (params) => {
        return {
          url: "/industry/advertisements/my-listings",
          method: "GET",
          params,
        };
      },
    }),
    getAdvertisemetSection: builder.query({
      query: () => {
        return {
          url: "/industry/advertisements/sections",
          method: "GET",
        };
      },
    }),
    getAdvertisemetCategories: builder.query({
      query: (id) => {
        return {
          url: `/industry/advertisements/sections/${id}/categories`,
          method: "GET",
        };
      },
    }),
    getAdvertisemetEdite: builder.query({
      query: (id) => {
        return {
          url: `/industry/advertisements/${id}`,
          method: "GET",
        };
      },
    }),
    createAdvertisement: builder.mutation({
      query: (data) => {
        return {
          url: `/industry/advertisements`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateAdvertisement: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/industry/advertisements/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetAdvertisementDashboardQuery,
  useGetAdvertisementDataQuery,
  useGetAdvertisemetSectionQuery,
  useGetAdvertisemetCategoriesQuery,
  useCreateAdvertisementMutation,
  useGetAdvertisemetEditeQuery,
} = advertisementSlice;
