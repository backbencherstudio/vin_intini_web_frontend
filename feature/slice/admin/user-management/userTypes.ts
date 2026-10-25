export type UserTier = "basic" | "premium" | "pro_industry" | string;

export type UserStatus = "active" | "suspended" | "all";

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
}

export interface UserPlan {
  id: number;
  name: string;
  plan_type: string;
  billing_rate: string;
  billing_cycle: "monthly" | "yearly" | string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface UserCompany {
  id: number;
  name: string;
  slug: string;
  industry: string;
  logo: string | null;
  website: string | null;
  company_size: string | null;
}

export interface User {
  sl_no?: number;
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile: string | null;
  profile_image_url: string | null;
  title: string | null;
  location: string | null;
  profession?: string[] | string | null;
  status: "active" | "suspended" | string;
  is_suspended: boolean;
  suspended_at: string | null;
  is_verified: boolean;
  terms_accepted_at: string | null;
  joined_at: string;
  created_at: string;
  tier: UserTier;
  plan?: UserPlan | null;
  company?: UserCompany | null;
}

export interface GetUsersResponse {
  success: boolean;
  tier?: string;
  total_users?: number;
  data: User[];
  pagination: Pagination;
}

export interface GetUsersParams {
  query?: {
    type?: UserTier;
    search?: string;
    status?: UserStatus;
    page?: number;
    per_page?: number;
    [key: string]: unknown;
  };
}

export interface LeaveRequest {
  sl_no?: number;
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  reason: string;
  request_date: string;
  permanently_delete: string;
  remaining_days: string;
}

export interface GetLeaveRequestsResponse {
  success: boolean;
  total_request?: number;
  data: LeaveRequest[];
  pagination: Pagination;
}

export interface GetLeaveRequestsParams {
  query?: {
    page?: number;
    per_page?: number;
    search?: string;
    [key: string]: unknown;
  };
}

