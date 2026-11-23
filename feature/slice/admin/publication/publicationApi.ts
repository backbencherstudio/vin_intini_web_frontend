import baseApiSlice from "../../baseApi";
import {
  GetPublicationsParams,
  GetPublicationsResponse,
  GetPublicationDetailsResponse,
  TogglePublicationStatusResponse,
  DeletePublicationResponse,
} from "./publicationType";

const publicationApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPublications: builder.query<
      GetPublicationsResponse,
      GetPublicationsParams | void
    >({
      query: (params) => ({
        url: "/admin/publications",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["publication"],
    }),

    getPublicationById: builder.query<
      GetPublicationDetailsResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/publications/${id}`,
        method: "GET",
      }),
      providesTags: ["publication"],
    }),

    togglePublicationStatus: builder.mutation<
      TogglePublicationStatusResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/publications/${id}/toggle-status`,
        method: "POST",
      }),
      invalidatesTags: ["publication"],
    }),

    deletePublication: builder.mutation<
      DeletePublicationResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/publications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["publication"],
    }),

    createAdminPublication: builder.mutation<
      { success: boolean; message: string; data: any },
      FormData
    >({
      query: (body) => ({
        url: "/admin/publications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["publication"],
    }),

    updateAdminPublication: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/publications/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["publication"],
    }),

    togglePublicationBoost: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; days?: number }
    >({
      query: ({ id, days = 30 }) => ({
        url: `/admin/publications/${id}/toggle-boost`,
        method: "POST",
        body: { days },
      }),
      invalidatesTags: ["publication"],
    }),
  }),
});

export const {
  useGetPublicationsQuery,
  useGetPublicationByIdQuery,
  useTogglePublicationStatusMutation,
  useDeletePublicationMutation,
  useCreateAdminPublicationMutation,
  useUpdateAdminPublicationMutation,
  useTogglePublicationBoostMutation,
} = publicationApi;

export default publicationApi;
