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

export interface ToggleUserSuspendResponse {
  success: boolean;
  message: string;
  data: Pick<User, "id" | "is_suspended" | "status" | "suspended_at">;
}

export interface UserDetailCompany {
  id: number;
  name: string;
  company_name?: string;
  logo?: string | null;
  logo_url?: string | null;
  website?: string | null;
}

export interface UserDetailProfile {
  about?: string | null;
  country?: string | null;
  address?: string | null;
  postal_code?: string | null;
  state?: { id: number; name: string } | null;
  profession?: string[] | string | null;
  interests?: string[] | null;
  highest_degree?: string | null;
  study_category?: string | null;
  field_study?: string | null;
  institution?: string | null;
  graduation_year?: string | number | null;
  skills?: { id: number; name: string }[];
  current_position?: UserDetailCompany | null;
  current_institute?: UserDetailCompany | null;
}

export interface UserDetailExperience {
  id: number;
  company_name?: string | null;
  company_logo_url?: string | null;
  title?: string | null;
  employment_type?: string | null;
  formatted_period?: string | null;
  formatted_location?: string | null;
  description?: string | null;
  is_current?: boolean;
}

export interface UserDetailEducation {
  id: number;
  institution_name?: string | null;
  institution_logo_url?: string | null;
  degree?: string | null;
  field_study?: string | null;
  formatted_period?: string | null;
  description?: string | null;
}

export interface UserDetailPost {
  id: number;
  description?: string | null;
  created_at?: string | null;
  created_at_formatted?: string | null;
  total_like?: number;
  total_comment?: number;
  media?: { id: number; url: string; type: string }[];
}

export interface UserDetailComment {
  id: number;
  post_id?: number;
  comment?: string | null;
  created_at?: string | null;
  created_at_formatted?: string | null;
  post?: { id: number; description_snippet: string } | null;
}

export interface AdminUserDetails extends User {
  about?: string | null;
  cover_image_url?: string | null;
  total_connections?: number;
  member_since?: string | null;
  current_company?: UserDetailCompany | null;
  graduated_institution?: UserDetailCompany | null;
  stats?: {
    posts_count?: number;
    comments_count?: number;
    connections_count?: number;
    followers_count?: number;
    following_count?: number;
  };
  activity?: {
    total_posts?: number;
    total_comments?: number;
    posts?: UserDetailPost[];
    comments?: UserDetailComment[];
  };
  profile?: UserDetailProfile | null;
  experiences?: UserDetailExperience[];
  educations?: UserDetailEducation[];
  subscription?: {
    is_subscribed?: boolean;
    plan_name?: string | null;
    plan_type?: string | null;
    billing_rate?: string | number | null;
    billing_cycle?: string | null;
    status?: string | null;
    current_period_end?: string | null;
    cancel_at_period_end?: boolean;
    features?: string[];
  };
  industry?: {
    id: number;
    name: string;
    industry?: string | null;
    website?: string | null;
    address?: string | null;
    company_size?: string | null;
    tagline?: string | null;
    description?: string | null;
    logo?: string | null;
  } | null;
}

export interface AdminUserDetailsResponse {
  success: boolean;
  data: AdminUserDetails;
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
  permanently_delete: string | null;
  remaining_days: string | null;
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

