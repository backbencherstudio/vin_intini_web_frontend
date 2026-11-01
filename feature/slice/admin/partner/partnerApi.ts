import baseApiSlice from "../../baseApi";
import type {
  GetPartnersParams,
  GetPartnersResponse,
  TogglePartnerPauseResponse,
} from "./partnerTypes";

const partnerApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminPartners: builder.query<GetPartnersResponse, GetPartnersParams | void>({
      query: (params) => ({
        url: "/admin/partners",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["partner"],
    }),
    toggleAdminPartnerPause: builder.mutation<
      TogglePartnerPauseResponse,
      { id: number | string; is_paused: boolean }
    >({
      query: ({ id, is_paused }) => ({
        url: `/admin/partners/${id}/toggle-pause`,
        method: "POST",
        body: { is_paused },
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const {
  useGetAdminPartnersQuery,
  useToggleAdminPartnerPauseMutation,
} = partnerApi;

export * from "./partnerTypes";
export default partnerApi;
