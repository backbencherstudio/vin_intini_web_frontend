import baseApiSlice from "../../baseApi";
import type {
  AdminProductStatus,
  DeleteAdminProductResponse,
  GetAdminProductsParams,
  GetAdminProductsResponse,
  GetAdminSectionProductsParams,
  GetAdminSectionProductsResponse,
  GetVerifiedIndustriesResponse,
  SingleAdminProductResponse,
  UpdateAdminProductStatusResponse,
} from "./productTypes";

const adminProductsApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminProducts: builder.query<
      GetAdminProductsResponse,
      GetAdminProductsParams
    >({
      query: (params) => ({
        url: "/admin/products",
        method: "GET",
        params: {
          network_type: params.network_type,
          industry_type: params.industry_type,
          limit_per_section: params.limit_per_section ?? 50,
          ...(params.status && params.status !== "all"
            ? { status: params.status }
            : {}),
          ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        },
      }),
      providesTags: ["adminProducts"],
    }),

    getAdminSectionProducts: builder.query<
      GetAdminSectionProductsResponse,
      GetAdminSectionProductsParams
    >({
      query: (params) => ({
        url: "/admin/products",
        method: "GET",
        params: {
          network_type: params.network_type,
          industry_type: params.industry_type,
          section_id: params.section_id,
          flat: 1,
          per_page: params.per_page ?? 12,
          ...(params.cursor ? { cursor: params.cursor } : {}),
          ...(params.category_id ? { category_id: params.category_id } : {}),
          ...(params.status && params.status !== "all"
            ? { status: params.status }
            : {}),
          ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        },
      }),
      providesTags: ["adminProducts"],
    }),

    getVerifiedIndustries: builder.query<
      GetVerifiedIndustriesResponse,
      { search?: string; industry_type?: string } | void
    >({
      query: (params) => ({
        url: "/admin/products/verified-industries",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["partner"],
    }),

    getAdminProductById: builder.query<
      SingleAdminProductResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "GET",
      }),
      providesTags: ["adminProducts"],
    }),

    createAdminProduct: builder.mutation<SingleAdminProductResponse, FormData>({
      query: (body) => ({
        url: "/admin/products/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adminProducts", "psychology", "neuroscience", "Advertisement"],
    }),

    updateAdminProduct: builder.mutation<
      SingleAdminProductResponse,
      { id: number | string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["adminProducts", "psychology", "neuroscience", "Advertisement"],
    }),

    updateAdminProductStatus: builder.mutation<
      UpdateAdminProductStatusResponse,
      { id: number | string; status: AdminProductStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/products/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["adminProducts", "psychology", "neuroscience", "Advertisement"],
    }),

    rejectAdminProduct: builder.mutation<
      SingleAdminProductResponse,
      { id: number | string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/products/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["adminProducts", "psychology", "neuroscience", "Advertisement"],
    }),

    deleteAdminProduct: builder.mutation<
      DeleteAdminProductResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/products/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["adminProducts", "psychology", "neuroscience", "Advertisement"],
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useGetAdminSectionProductsQuery,
  useLazyGetAdminSectionProductsQuery,
  useGetVerifiedIndustriesQuery,
  useGetAdminProductByIdQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useUpdateAdminProductStatusMutation,
  useRejectAdminProductMutation,
  useDeleteAdminProductMutation,
} = adminProductsApi;

export default adminProductsApi;

