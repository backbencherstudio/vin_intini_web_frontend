import baseApiSlice from "../../baseApi";

export type BoostTargetEntity = "all" | "product" | "post" | "publication" | "job";
export type BoostPlacement = "product_feed" | "newsfeed";
export type AdminAdCampaignStatus = "all" | "active" | "paused" | "completed" | "cancelled" | "pending";

export interface BoostPackage {
  id: number;
  name: string;
  target_entity: string;
  placements?: BoostPlacement[];
  duration_days: number;
  price: number;
  daily_price?: number;
  estimated_impressions: string | null;
  badge: string | null;
  promotion_highlight: string | null;
  description: string | null;
  features: string[];
  priority_weight: number;
  sort_order?: number;
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
  Partial<Pick<BoostPackage, "placements" | "estimated_impressions" | "badge" | "promotion_highlight" | "description" | "features" | "priority_weight" | "sort_order" | "status">>;

export interface BoostSettings {
  custom_slider: { enabled: boolean; daily_rate: number; currency: string; min_days: number; max_days: number; daily_estimated_impressions_min: number; daily_estimated_impressions_max: number };
  new_release: { hours: number };
  pause_policy: { max_days: number; first_reminder_days: number; final_reminder_days: number };
  newsfeed_ads: { enabled: boolean; min_posts_before_ad: number; first_ad_slot: number; ad_interval: number; max_ads_per_page: number; max_daily_impressions_per_user: number };
}

export interface AdminAdCampaign {
  id: number;
  ad_type: string;
  network_type: string | null;
  placements: string[];
  package_id: number | null;
  package_name: string;
  is_custom: boolean;
  duration_days: number;
  amount_paid: string;
  currency: string;
  status: "active" | "paused" | "completed" | "cancelled" | "pending" | string;
  starts_at: string | null;
  ends_at: string | null;
  paused_at: string | null;
  remaining_days: number;
  remaining_text: string;
  total_impressions: number;
  total_clicks: number;
  ctr: number;
  payment_platform: string;
  payment_reference: string | null;
  transaction_id: number | null;
  invoice_number: string | null;
  created_at: string | null;
  user: {
    id: number;
    name: string;
    username: string | null;
    email: string | null;
    image: string | null;
  } | null;
  industry: {
    id: number;
    name: string;
    slug: string | null;
    logo: string | null;
    address: string | null;
    website: string | null;
  } | null;
  item: {
    id: number;
    code: string | null;
    name: string;
    slug: string | null;
    image: string | null;
    type: string;
  } | null;
}

export interface AdminAdCampaignOverview {
  total_campaigns: number;
  live_campaigns: number;
  paused_campaigns: number;
  completed_campaigns: number;
  cancelled_campaigns: number;
  total_revenue: number;
  preset_revenue: number;
  custom_revenue: number;
  preset_count: number;
  custom_count: number;
  total_impressions: number;
  total_clicks: number;
  avg_ctr: number;
}

export interface AdminAdCampaignCounts {
  all: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
  pending: number;
}

export interface AdminAdCampaignsResponse {
  success: boolean;
  overview: AdminAdCampaignOverview;
  counts: AdminAdCampaignCounts;
  data: AdminAdCampaign[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GetAdminAdCampaignsParams {
  page?: number;
  per_page?: number;
  status?: AdminAdCampaignStatus;
  network_type?: string;
  boost_package_id?: string | number;
  search?: string;
  date_from?: string;
  date_to?: string;
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
    reorderBoostPackages: builder.mutation<{ success: boolean; message: string; data: BoostPackage[] }, number[]>({
      query: (package_ids) => ({ url: "/admin/boost-packages/reorder", method: "POST", body: { package_ids } }),
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

    // Admin Ad Campaigns Management (Overview + Pause / Resume / Cancel)
    getAdCampaigns: builder.query<AdminAdCampaignsResponse, GetAdminAdCampaignsParams | void>({
      query: (params) => ({
        url: "/admin/boost-campaigns",
        method: "GET",
        params: params ? { ...params } : undefined,
      }),
      providesTags: ["boosting"],
    }),
    getAdCampaignDetail: builder.query<{ success: boolean; data: AdminAdCampaign }, number | string>({
      query: (id) => ({
        url: `/admin/boost-campaigns/${id}`,
        method: "GET",
      }),
      providesTags: ["boosting"],
    }),
    pauseAdCampaign: builder.mutation<{ success: boolean; message: string; data: AdminAdCampaign }, number | string>({
      query: (id) => ({
        url: `/admin/boost-campaigns/${id}/pause`,
        method: "POST",
      }),
      invalidatesTags: ["boosting"],
    }),
    resumeAdCampaign: builder.mutation<{ success: boolean; message: string; data: AdminAdCampaign }, number | string>({
      query: (id) => ({
        url: `/admin/boost-campaigns/${id}/resume`,
        method: "POST",
      }),
      invalidatesTags: ["boosting"],
    }),
    cancelAdCampaign: builder.mutation<{ success: boolean; message: string; data: AdminAdCampaign }, number | string>({
      query: (id) => ({
        url: `/admin/boost-campaigns/${id}/cancel`,
        method: "POST",
      }),
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
  useReorderBoostPackagesMutation,
  useGetBoostSettingsQuery,
  useUpdateBoostSettingsMutation,
  useGetAdCampaignsQuery,
  useGetAdCampaignDetailQuery,
  usePauseAdCampaignMutation,
  useResumeAdCampaignMutation,
  useCancelAdCampaignMutation,
} = boostApi;
