export type PublicationStatus = "active" | "inactive" | "draft" | string;
export type NetworkType = "neuroscience" | "psychology" | string;
export type PublicationType = "professional" | "university" | string;

export interface PublicationCreator {
  id: number;
  name: string;
  email: string;
  username: string;
  profile_image_url?: string | null;
  tier?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  mobile?: string;
  title?: string;
  is_verified?: boolean;
  is_suspended?: boolean;
  status?: string;
}

export interface PublicationIndustry {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  industry?: string;
  website?: string;
  address?: string;
  company_size?: string;
  views_count?: number;
}

export interface PublicationItem {
  sl_no?: number;
  id: number;
  publication_id: string;
  title: string;
  slug: string;
  network_type: NetworkType;
  publication_type: PublicationType;
  status: PublicationStatus;
  authors: string[];
  short_abstract?: string;
  abstract?: string;
  website_url?: string;
  attachment?: string;
  attachment_url?: string;
  information_confirmed: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  created_at_iso?: string;
  updated_at?: string;
  updated_at_iso?: string;
  deleted_at?: string | null;
  is_deleted?: boolean;
  creator?: PublicationCreator | null;
  industry?: PublicationIndustry | null;
}

export interface PublicationStatistics {
  total_publications: number;
  active_publications: number;
  inactive_publications: number;
  draft_publications: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
}

export interface GetPublicationsResponse {
  success: boolean;
  statistics?: PublicationStatistics;
  overview?: PublicationStatistics;
  data: PublicationItem[];
  pagination: Pagination;
}

export interface GetPublicationsParams {
  query?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: PublicationStatus;
    network_type?: string;
    [key: string]: unknown;
  };
}

export interface GetPublicationDetailsResponse {
  success: boolean;
  data: PublicationItem;
}

export interface TogglePublicationStatusResponse {
  success: boolean;
  message?: string;
}

export interface DeletePublicationResponse {
  success: boolean;
  message?: string;
}
