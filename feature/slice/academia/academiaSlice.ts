import baseApiSlice from "../baseApi";

const acadamiaSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademia: builder.query({
      query: () => ({
        url: `/states`,
        method: "GET",
      }),
    }),
    getAcademiaByState: builder.query({
      query: (id) => ({
        url: `/states/${id}`,
        method: "GET",
      }),
    }),
    getUndergradGradPrograms: builder.query({
      query: ({id,limit,page, searchItem, degree}) => ({
        url: `/states/${id}/universities?per_page=${limit}&page=${page}&search=${searchItem}${degree ? `&degree=${degree}` : ''}`,
        method: "GET",
      }),
    }),
    getResidencies: builder.query({
      query: ({id,limit,page, searchItem}) => ({
        url: `/states/${id}/residencies?limit=${limit}&page=${page}&search=${searchItem}`,
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

export const { useGetAcademiaQuery, useGetUndergradGradProgramsQuery, useGetResidenciesQuery, useGetHospitalsQuery, useGetAcademiaByStateQuery } = acadamiaSlice;
