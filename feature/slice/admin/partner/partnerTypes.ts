export type PartnerStatus = "active" | "paused" | string;

export interface PartnerOwner {
  id: number;
  full_name: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  mobile?: string | null;
  profile_image_url?: string | null;
  title?: string | null;
  location?: string | null;
  is_verified?: boolean;
  is_suspended?: boolean;
}

export interface Partner {
  sl_no: number;
  id: number;
  name: string;
  slug: string;
  industry: string | null;
  industry_type?: string | null;
  logo_url: string | null;
  website: string | null;
  tagline: string | null;
  description: string | null;
  company_size: string | null;
  views_count: number;
  status: PartnerStatus;
  is_paused: boolean;
  paused_at: string | null;
  created_at: string | null;
  created_at_formatted: string | null;
  owner: PartnerOwner | null;
}

export interface PartnerSummary {
  total_partners: number;
  active_partners: number;
  paused_partners: number;
}

export interface PartnerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface GetPartnersResponse {
  success: boolean;
  message: string;
  summary: PartnerSummary;
  data: Partner[];
  pagination: PartnerPagination;
}

export interface GetPartnersParams {
  query?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: "all" | "active" | "paused";
    industry?: string;
  };
}

export interface TogglePartnerPauseResponse {
  success: boolean;
  message: string;
  data: Pick<Partner, "id" | "name" | "status" | "is_paused" | "paused_at"> & {
    updated_at: string;
  };
}
