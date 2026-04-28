import baseApiSlice from "../baseApi";

const acadamiaSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademia: builder.query({
      query: () => ({
        url: `/states`,
        method: "GET",
      }),
    }),
    getUndergradGradPrograms: builder.query({
      query: (id) => ({
        url: `/states/${id}/universities`,
        method: "GET",
      }),
    }),
    getResidencies: builder.query({
      query: (id) => ({
        url: `/states/${id}/residencies`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAcademiaQuery, useGetUndergradGradProgramsQuery, useGetResidenciesQuery } = acadamiaSlice;
