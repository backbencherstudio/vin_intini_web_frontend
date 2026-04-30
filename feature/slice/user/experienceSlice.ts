import baseApiSlice from "../baseApi";

const experienceSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperience: builder.query({
      query: () => ({
        url: "/experience/list",
        method: "GET",
      }),
      providesTags: ["experience"],
    }),
    getCompanySuggestions: builder.query({
      query: () => ({
        url: "/company-suggestions",
        method: "GET",
      }),
      providesTags: ["experience"],
    }),
    getSkillSuggestions: builder.query({
      query: () => ({
        url: "/skill-suggestions",
        method: "GET",
      }),
      providesTags: ["experience"],
    }),
    getExperienceById: builder.query({
      query: (id) => ({
        url: `/experience/edit/${id}`,
        method: "GET",
      }),
      providesTags: ["experience"],
    }),

    addExperience: builder.mutation({
      query: (payload) => ({
        url: "/experience/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["experience"],
    }),
    updateExperience: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/experience/update/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["experience"],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/experience/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["experience"],
    }),
  }),
});

export const {
  useGetExperienceQuery,
  useGetCompanySuggestionsQuery,
  useGetSkillSuggestionsQuery,
  useGetExperienceByIdQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceSlice;
