import baseApiSlice from "../../baseApi";

export type IntegrationSettings = Record<string, { key: string; value: string }[]>;

export const integrationApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getIntegrationSettings: builder.query<{ success: boolean; data: IntegrationSettings }, void>({
      query: () => "/admin/integrations",
      providesTags: ["integrationSettings"],
    }),
    updateIntegrationSettings: builder.mutation<{ success: boolean; message: string }, { settings: Record<string, string> }>({
      query: (body) => ({ url: "/admin/integrations", method: "POST", body }),
      invalidatesTags: ["integrationSettings"],
    }),
  }),
});

export const { useGetIntegrationSettingsQuery, useUpdateIntegrationSettingsMutation } = integrationApi;
