import baseApiSlice from "../../baseApi";
import type {
  CityActionResponse,
  CreateCityPayload,
  GetCitiesParams,
  GetCitiesResponse,
  GetStatesResponse,
  UpdateCityPayload,
} from "./cityTypes";

export const cityApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminCities: builder.query<GetCitiesResponse, GetCitiesParams | void>({
      query: (params) => ({
        url: "/admin/cities",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["city"],
    }),
    getAdminStatesForCities: builder.query<GetStatesResponse, void>({
      query: () => ({
        url: "/admin/cities/states",
        method: "GET",
      }),
      providesTags: ["state"],
    }),
    createAdminCity: builder.mutation<CityActionResponse, CreateCityPayload>({
      query: (body) => ({
        url: "/admin/cities",
        method: "POST",
        body,
      }),
      invalidatesTags: ["city", "state"],
    }),
    updateAdminCity: builder.mutation<CityActionResponse, UpdateCityPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/cities/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["city"],
    }),
    deleteAdminCity: builder.mutation<CityActionResponse, number | string>({
      query: (id) => ({
        url: `/admin/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["city", "state"],
    }),
  }),
});

export const {
  useGetAdminCitiesQuery,
  useGetAdminStatesForCitiesQuery,
  useCreateAdminCityMutation,
  useUpdateAdminCityMutation,
  useDeleteAdminCityMutation,
} = cityApi;

export * from "./cityTypes";
export default cityApi;
