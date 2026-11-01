import baseApiSlice from "../../baseApi";
import {
  CreateCategoryTabArgs,
  CreateCategoryTabPayload,
  CreateCategoryTabResponse,
  CreateSectionPayload,
  CreateSectionResponse,
  DeleteCategoryTabResponse,
  DeleteSectionArgs,
  DeleteSectionResponse,
  GetCategorySectionsResponse,
  GetNeuroscienceSectionsParams,
  GetPsychologySectionsParams,
  UpdateCategoryTabArgs,
  UpdateCategoryTabResponse,
  UpdateSectionPayload,
  UpdateSectionResponse,
} from "./categoryType";

const categorySlice = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ============ Psychology Sections ============
    // Endpoint: GET {{ _.base_url }}/admin/categories/psychology?type=&per_page=10&page=1
    getPsychologySections: builder.query<
      GetCategorySectionsResponse,
      GetPsychologySectionsParams | void
    >({
      query: (params) => ({
        url: "/admin/categories/psychology",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["category", "psychology"],
    }),

    // Endpoint: POST {{ _.base_url }}/admin/categories/psychology/create
    createPsychologySection: builder.mutation<
      CreateSectionResponse,
      CreateSectionPayload
    >({
      query: (body) => ({
        url: "/admin/categories/psychology/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["category", "psychology"],
    }),

    // Endpoint: PUT /admin/categories/psychology/update/:id
    updatePsychologySection: builder.mutation<
      UpdateSectionResponse,
      { id: number | string; body: UpdateSectionPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/psychology/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["category", "psychology"],
    }),

    // ============ Neuroscience Sections ============
    // Endpoint: GET {{ _.base_url }}/admin/categories/neuroscience?type=&per_page=10&page=1
    getNeuroscienceSections: builder.query<
      GetCategorySectionsResponse,
      GetNeuroscienceSectionsParams | void
    >({
      query: (params) => ({
        url: "/admin/categories/neuroscience",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["category", "neuroscience"],
    }),

    // Endpoint: POST {{ _.base_url }}/admin/categories/neuroscience/create
    createNeuroscienceSection: builder.mutation<
      CreateSectionResponse,
      CreateSectionPayload
    >({
      query: (body) => ({
        url: "/admin/categories/neuroscience/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["category", "neuroscience"],
    }),

    // Endpoint: PUT {{ _.base_url }}/admin/categories/neuroscience/update/:id
    updateNeuroscienceSection: builder.mutation<
      UpdateSectionResponse,
      { id: number | string; body: UpdateSectionPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/neuroscience/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["category", "neuroscience"],
    }),


    // ============ Delete Section ============
    // Endpoint: DELETE {{ _.base_url }}/admin/categories/section/delete/:id
    deleteCategorySection: builder.mutation<
      DeleteSectionResponse,
      number | string | DeleteSectionArgs
    >({
      query: (arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return {
          url: `/admin/categories/section/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["category", "psychology", "neuroscience"],
    }),

    // ============ Subcategory Tab CRUD ============
    // Endpoint: POST /admin/categories/sub-category/create
    createCategoryTab: builder.mutation<
      CreateCategoryTabResponse,
      CreateCategoryTabPayload | CreateCategoryTabArgs
    >({
      query: (arg) => {
        const body =
          "body" in arg && arg.body
            ? { section_id: arg.section_id, ...arg.body }
            : arg;
        return {
          url: "/admin/categories/sub-category/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["category", "psychology", "neuroscience"],
    }),

    // Endpoint: PUT /admin/categories/sub-category/update/:id
    updateCategoryTab: builder.mutation<
      UpdateCategoryTabResponse,
      UpdateCategoryTabArgs
    >({
      query: (arg) => {
        const id = arg.id;
        const body =
          "body" in arg && arg.body
            ? arg.body
            : { category_name: arg.category_name };
        return {
          url: `/admin/categories/sub-category/update/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["category", "psychology", "neuroscience"],
    }),

    // Endpoint: DELETE /admin/categories/sub-category/delete/:id
    deleteCategoryTab: builder.mutation<
      DeleteCategoryTabResponse,
      number | string | { id: number | string }
    >({
      query: (arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return {
          url: `/admin/categories/sub-category/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["category", "psychology", "neuroscience"],
    }),
  }),
});

export const {
  // Psychology hooks
  useGetPsychologySectionsQuery,
  useCreatePsychologySectionMutation,
  useUpdatePsychologySectionMutation,

  // Neuroscience hooks
  useGetNeuroscienceSectionsQuery,
  useCreateNeuroscienceSectionMutation,
  useUpdateNeuroscienceSectionMutation,

  // delete section hooks
  useDeleteCategorySectionMutation,

  // tab hooks
  useCreateCategoryTabMutation,
  useUpdateCategoryTabMutation,
  useDeleteCategoryTabMutation,
} = categorySlice;

export default categorySlice;
