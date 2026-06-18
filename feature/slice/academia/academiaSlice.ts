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
      query: ({ id, limit, page, searchItem, degree, sort }) => ({
        url: `/states/${id}/universities?per_page=${limit}&page=${page}&search=${searchItem}${degree ? `&degree=${degree}` : ""}${sort ? `&sort=${sort}` : ""}`,
        method: "GET",
      }),
    }),
    getResidencies: builder.query({
      query: ({ id, limit, page, searchItem, degree, sort }) => ({
        url: `/states/${id}/residencies?limit=${limit}&page=${page}&search=${searchItem}${degree ? `&degree=${degree}` : ""}${sort ? `&sort=${sort}` : ""}`,
        method: "GET",
      }),
    }),
    getHospitals: builder.query({
      query: ({ id, type, limit, page, sort }) => ({
        url: `/states/${id}/facilities?type=${type}&limit=${limit}&page=${page}${sort ? `&sort=${sort}` : ""}`,
        method: "GET",
      }),
    }),
    getEmployments: builder.query({
      query: ({ id, perPage, page, sort }) => ({
        url: `/states/${id}/jobs?per_page=${perPage}&page=${page}${sort ? `&sort=${sort}` : ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAcademiaQuery,
  useGetUndergradGradProgramsQuery,
  useGetResidenciesQuery,
  useGetHospitalsQuery,
  useGetAcademiaByStateQuery,
  useGetEmploymentsQuery,
} = acadamiaSlice;
