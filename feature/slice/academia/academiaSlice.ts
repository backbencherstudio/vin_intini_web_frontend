import baseApiSlice from "../baseApi";

const acadamiaSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademia: builder.query({
      query: () => ({
        url: `/academia`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAcademiaQuery } = acadamiaSlice;
