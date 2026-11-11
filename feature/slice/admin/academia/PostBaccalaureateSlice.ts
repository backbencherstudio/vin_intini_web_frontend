import baseApiSlice from "../../baseApi";
import type {
  PostBaccalaureateCategoryType,
  PostBaccalaureateProgramType,
} from "@/lib/type";

export interface PostBaccalaureateCategoriesResponse {
  success: boolean;
  message: string;
  data: PostBaccalaureateCategoryType[];
}

export interface PostBaccalaureateProgramsResponse {
  success: boolean;
  message: string;
  data: PostBaccalaureateProgramType[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

const postBaccalaureateSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPostBaccalaureateCategories: builder.query<
      PostBaccalaureateCategoriesResponse,
      { active_only?: boolean } | void
    >({
      query: (params) => ({
        url: "/admin/academia/post-baccalaureate/categories",
        method: "GET",
        ...(params ? { params } : {}),
      }),
      providesTags: ["postBaccalaureateCategories"],
    }),

    createPostBaccalaureateCategory: builder.mutation<
      { success: boolean; message: string; data: PostBaccalaureateCategoryType },
      { name: string; is_active?: boolean }
    >({
      query: (payload) => ({
        url: "/admin/academia/post-baccalaureate/category/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["postBaccalaureateCategories", "postBaccalaureatePrograms"],
    }),

    updatePostBaccalaureateCategory: builder.mutation<
      { success: boolean; message: string; data: PostBaccalaureateCategoryType },
      { id: number; name?: string; is_active?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/academia/post-baccalaureate/category/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["postBaccalaureateCategories", "postBaccalaureatePrograms"],
    }),

    reorderPostBaccalaureateCategories: builder.mutation<
      PostBaccalaureateCategoriesResponse,
      { category_ids: number[] }
    >({
      query: (payload) => ({
        url: "/admin/academia/post-baccalaureate/categories/reorder",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["postBaccalaureateCategories", "postBaccalaureatePrograms"],
    }),

    deletePostBaccalaureateCategory: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/academia/post-baccalaureate/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["postBaccalaureateCategories"],
    }),

    getAllPostBaccalaureatePrograms: builder.query<
      PostBaccalaureateProgramsResponse,
      {
        search?: string;
        state_id?: string | number;
        category_id?: string | number;
        per_page?: number;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "/admin/academia/post-baccalaureate",
        method: "GET",
        params,
      }),
      providesTags: ["postBaccalaureatePrograms"],
    }),

    createPostBaccalaureateProgram: builder.mutation<
      { success: boolean; message: string; data: PostBaccalaureateProgramType },
      {
        program_name: string;
        state_id: number;
        location?: string | null;
        latitude?: string | number | null;
        longitude?: string | number | null;
        website?: string | null;
        phone?: string | null;
        category_ids: number[];
      }
    >({
      query: (payload) => ({
        url: "/admin/academia/post-baccalaureate/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "postBaccalaureatePrograms",
        "postBaccalaureateCategories",
        "state",
      ],
    }),

    editPostBaccalaureateProgram: builder.mutation<
      { success: boolean; message: string; data: PostBaccalaureateProgramType },
      {
        id: number;
        program_name?: string;
        state_id?: number;
        location?: string | null;
        latitude?: string | number | null;
        longitude?: string | number | null;
        website?: string | null;
        phone?: string | null;
        category_ids?: number[];
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/academia/post-baccalaureate/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        "postBaccalaureatePrograms",
        "postBaccalaureateCategories",
        "state",
      ],
    }),

    deletePostBaccalaureateProgram: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/academia/post-baccalaureate/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "postBaccalaureatePrograms",
        "postBaccalaureateCategories",
        "state",
      ],
    }),
  }),
});

export const {
  useGetPostBaccalaureateCategoriesQuery,
  useCreatePostBaccalaureateCategoryMutation,
  useUpdatePostBaccalaureateCategoryMutation,
  useReorderPostBaccalaureateCategoriesMutation,
  useDeletePostBaccalaureateCategoryMutation,
  useGetAllPostBaccalaureateProgramsQuery,
  useCreatePostBaccalaureateProgramMutation,
  useEditPostBaccalaureateProgramMutation,
  useDeletePostBaccalaureateProgramMutation,
} = postBaccalaureateSlice;

