import baseApiSlice from "../../baseApi";

export interface StatusCardItem {
  key: string;
  title: string;
  value: string;
  raw_value: number;
  percentage: string;
  direction: "up" | "down" | "flat";
  link?: string | null;
}

export interface RevenueChartPoint {
  dateLabel: string;
  dateStr: string;
  comparisonDateStr: string;
  currentPeriod: number;
  lastPeriod: number;
  rawCurrentPeriod?: number;
  rawLastPeriod?: number;
}

export interface RevenueReportData {
  totalRevenue: number;
  growthRate: number;
  direction: "up" | "down";
  dateRange: string;
  chartData: RevenueChartPoint[];
}

export interface UserGrowthPoint {
  month: string;
  users: number;
  raw_count?: number;
}

export interface UserGrowthData {
  totalUsers: number;
  growthRate: number;
  direction: "up" | "down";
  chartData: UserGrowthPoint[];
}

export interface RevenueBreakdownItem {
  name: string;
  percentage: number;
  amount: number;
  value: number;
}

export interface RevenueBreakdownData {
  total: number;
  items: RevenueBreakdownItem[];
}

export interface PendingApprovalItem {
  title: string;
  count: number;
  link: string;
}

export interface RecentActivityItem {
  id: string;
  type:
    | "user_registered"
    | "ad_submitted"
    | "subscription_purchased"
    | "publication_created"
    | "contact_submitted";
  title: string;
  desc: string;
  time: string;
  created_at: string;
  timestamp?: number;
}

export interface AdminDashboardData {
  status_cards: StatusCardItem[];
  revenue_report: RevenueReportData;
  user_growth: UserGrowthData;
  total_revenue_breakdown: RevenueBreakdownData;
  pending_approvals: PendingApprovalItem[];
  recent_activities: RecentActivityItem[];
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

export const adminDashboardApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<
      AdminDashboardResponse,
      { date_from?: string; date_to?: string } | void
    >({
      query: (params) => ({
        url: "/admin/dashboard",
        params: params ? { ...params } : undefined,
      }),
      providesTags: ["adminDashboard" as any],
    }),
  }),
});

export const { useGetAdminDashboardQuery } = adminDashboardApi;
export default adminDashboardApi;
