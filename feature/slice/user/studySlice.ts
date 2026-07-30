import baseApiSlice from "../baseApi";

const studySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudy: builder.query({
      query: () => ({
        url: "/education/list",
        method: "GET",
      }),
      providesTags: ["study"],
    }),
    getInstitutionSuggestions: builder.query({
      query: () => ({
        url: "/institution-suggestions",
        method: "GET",
      }),
      providesTags: ["study"],
    }),

    getStudyById: builder.query({
      query: (id) => ({
        url: `/education/edit/${id}`,
        method: "GET",
      }),
      providesTags: ["study"],
    }),

    addStudy: builder.mutation({
      query: (payload) => ({
        url: "/education/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["study"],
    }),
    updateStudy: builder.mutation({
      query: ({ id, payload }) => ({
        url: `education/update/${id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["study"],
    }),
    deleteStudy: builder.mutation({
      query: (id) => ({
        url: `/education/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["study"],
    }),
  }),
});

export const {
  useGetStudyQuery,
  useGetInstitutionSuggestionsQuery,
  useGetStudyByIdQuery,
  useAddStudyMutation,
  useUpdateStudyMutation,
  useDeleteStudyMutation,
} = studySlice;
