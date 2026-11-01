import baseApiSlice from "./baseApi";

const settingSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generalSettingUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/profile/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    generalPrivacySettingUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/user/privacy-settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAllStates: builder.query({
      query: () => ({
        url: "/states",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getAllBilingHistory: builder.query({
      query: (params) => {
        if (!params) {
          return {
            url: "/billing-history",
            method: "GET",
          };
        }
        if (typeof params === "string") {
          return {
            url: `/billing-history?type=${params}`,
            method: "GET",
          };
        }
        return {
          url: "/billing-history",
          method: "GET",
          params,
        };
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGeneralSettingUpdateMutation,
  useGeneralPrivacySettingUpdateMutation,
  useGetAllStatesQuery,
  useGetAllBilingHistoryQuery,
} = settingSlice;
