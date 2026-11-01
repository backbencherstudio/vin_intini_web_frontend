import baseApiSlice from "../../baseApi";

export type BoostTargetEntity = "all" | "product" | "post" | "publication" | "job";

export interface BoostPackage {
  id: number;
  name: string;
  target_entity: string;
  duration_days: number;
  price: number;
  daily_price?: number;
  estimated_impressions: string | null;
  badge: string | null;
  promotion_highlight: string | null;
  description: string | null;
  features: string[];
  priority_weight: number;
  status: "active" | "inactive";
  is_active: boolean;
  active_campaigns_count?: number;
  total_campaigns_count?: number;
}

export interface BoostOverview {
  total_packages: number;
  active_packages: number;
  total_ad_revenue: number;
  live_campaigns_count: number;
  total_impressions_delivered: number;
  total_clicks_recorded: number;
  custom_packages: { total_purchased_count: number; live_campaigns_count: number; total_revenue: number };
  preset_packages: { total_purchased_count: number; live_campaigns_count: number; total_revenue: number };
}

export interface BoostPackagesResponse {
  success: boolean;
  overview: BoostOverview;
  data: BoostPackage[];
}

export type BoostPackagePayload = Pick<BoostPackage, "name" | "target_entity" | "duration_days" | "price"> &
  Partial<Pick<BoostPackage, "estimated_impressions" | "badge" | "promotion_highlight" | "description" | "features" | "priority_weight" | "status">>;

export interface BoostSettings {
  custom_slider: { enabled: boolean; daily_rate: number; currency: string; min_days: number; max_days: number; daily_estimated_impressions_min: number; daily_estimated_impressions_max: number };
  new_release: { hours: number };
  pause_policy: { max_days: number; first_reminder_days: number; final_reminder_days: number };
  newsfeed_ads: { enabled: boolean; min_posts_before_ad: number; first_ad_slot: number; ad_interval: number; max_ads_per_page: number; max_daily_impressions_per_user: number };
}

export const boostApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBoostPackages: builder.query<BoostPackagesResponse, { target_entity?: string; status?: string; search?: string } | void>({
      query: (params) => ({ url: "/admin/boost-packages", params: params ? { ...params } : undefined }),
      providesTags: ["boosting"],
    }),
    getBoostPackage: builder.query<{ success: boolean; data: BoostPackage }, number | string>({
      query: (id) => `/admin/boost-packages/${id}/show`,
      providesTags: ["boosting"],
    }),
    createBoostPackage: builder.mutation<{ success: boolean; data: BoostPackage }, BoostPackagePayload>({
      query: (body) => ({ url: "/admin/boost-packages/store", method: "POST", body }),
      invalidatesTags: ["boosting"],
    }),
    updateBoostPackage: builder.mutation<{ success: boolean; data: BoostPackage }, { id: number | string; body: Partial<BoostPackagePayload> }>({
      query: ({ id, body }) => ({ url: `/admin/boost-packages/${id}/update`, method: "PATCH", body }),
      invalidatesTags: ["boosting"],
    }),
    toggleBoostPackageStatus: builder.mutation<{ success: boolean; data: BoostPackage }, number | string>({
      query: (id) => ({ url: `/admin/boost-packages/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["boosting"],
    }),
    deleteBoostPackage: builder.mutation<{ success: boolean; message: string }, number | string>({
      query: (id) => ({ url: `/admin/boost-packages/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["boosting"],
    }),
    getBoostSettings: builder.query<{ success: boolean; data: BoostSettings }, void>({
      query: () => "/admin/boost-settings",
      providesTags: ["boosting"],
    }),
    updateBoostSettings: builder.mutation<{ success: boolean; data: BoostSettings }, Partial<BoostSettings> & { newsfeed_min_posts?: number; newsfeed_max_ads_per_page?: number }>({
      query: (body) => ({ url: "/admin/boost-settings", method: "PATCH", body }),
      invalidatesTags: ["boosting"],
    }),
  }),
});

export const {
  useGetBoostPackagesQuery,
  useGetBoostPackageQuery,
  useCreateBoostPackageMutation,
  useUpdateBoostPackageMutation,
  useToggleBoostPackageStatusMutation,
  useDeleteBoostPackageMutation,
  useGetBoostSettingsQuery,
  useUpdateBoostSettingsMutation,
} = boostApi;
