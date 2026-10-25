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
  }),
});

export const {
  useGetPublicationsQuery,
  useGetPublicationByIdQuery,
  useTogglePublicationStatusMutation,
  useDeletePublicationMutation,
} = publicationApi;

export default publicationApi;
