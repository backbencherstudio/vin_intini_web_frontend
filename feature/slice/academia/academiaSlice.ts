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
      query: ({id,limit,page}) => ({
        url: `/states/${id}/universities?limit=${limit}&page=${page}`,
        method: "GET",
      }),
    }),
    getResidencies: builder.query({
      query: ({id,limit,page}) => ({
        url: `/states/${id}/residencies?limit=${limit}&page=${page}`,
        method: "GET",
      }),
    }),
    getHospitals: builder.query({
      query: ({id,type,limit,page}) => ({
        url: `/states/${id}/facilities?type=${type}&limit=${limit}&page=${page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAcademiaQuery, useGetUndergradGradProgramsQuery, useGetResidenciesQuery, useGetHospitalsQuery } = acadamiaSlice;
