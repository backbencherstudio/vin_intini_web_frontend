export type AdminNetworkType = "psychology" | "neuroscience";
export type AdminIndustryType = "biotechnology" | "psychotropics";
export type AdminProductStatus = "active" | "inactive" | "draft" | "rejected";

export interface VerifiedIndustryOwner {
  id: number;
  full_name: string;
  email: string;
  is_verified: boolean;
}

export interface VerifiedIndustryOption {
  id: number;
  name: string;
  slug: string;
  industry: string | null;
  status: string;
  logo_url: string | null;
  website: string | null;
  authorization_confirmed: boolean;
  owner: VerifiedIndustryOwner | null;
}

export interface AdminProductIndustryInfo {
  id: number;
  name: string;
  logo: string | null;
}

export interface AdminProductCreatorInfo {
  id: number;
  name: string;
  username?: string | null;
  profile_image?: string | null;
}

export interface AdminProductItem {
  id: number;
  product_id: string | null;
  product_name: string;
  slug: string;
  network_type: AdminNetworkType;
  industry_type: AdminIndustryType;
  section_id: number;
  section_name?: string | null;
  category_id: number;
  category_name?: string | null;
  short_description: string;
  description: string;
  product_url: string | null;
  image_url: string | null;
  image?: string | null;
  tags: string[] | null;
  status: AdminProductStatus;
  rejection_reason?: string | null;
  rejected_at?: string | null;
  is_boosted: boolean;
  boost_status?: string | null;
  is_new_release: boolean;
  badge: string | null;
  views_count: number;
  unique_views_count?: number;
  likes_count: number;
  impressions_count?: number;
  clicks_count?: number;
  ctr?: number;
  ctr_formatted?: string;
  boost_days_left?: number | null;
  boost_remaining_text?: string | null;
  creator_id?: number | null;
  industry_id: number;
  poc_name?: string | null;
  poc_email?: string | null;
  poc_phone?: string | null;
  information_confirmed?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  industry: AdminProductIndustryInfo | null;
  creator: AdminProductCreatorInfo | null;
}

export interface AdminProductCategoryTab {
  id: number;
  category_name: string;
  products_count: number;
}

export interface AdminProductSection {
  id: number;
  name: string;
  network_type: AdminNetworkType;
  industry_type: AdminIndustryType;
  total_products: number;
  has_more: boolean;
  categories: AdminProductCategoryTab[];
  products: AdminProductItem[];
}

export interface AdminProductsSummary {
  total_products: number;
  active_products: number;
  inactive_products: number;
  draft_products: number;
  rejected_products?: number;
}

export interface GetAdminProductsParams {
  network_type: AdminNetworkType;
  industry_type: AdminIndustryType;
  status?: AdminProductStatus | "all";
  search?: string;
  limit_per_section?: number;
}

export interface GetAdminProductsResponse {
  success: boolean;
  message: string;
  data: {
    network_type: AdminNetworkType;
    industry_type: AdminIndustryType;
    summary: AdminProductsSummary;
    sections: AdminProductSection[];
  };
}

export interface GetAdminSectionProductsParams {
  network_type: AdminNetworkType;
  industry_type: AdminIndustryType;
  section_id: number;
  category_id?: number;
  status?: AdminProductStatus | "all";
  search?: string;
  flat?: boolean;
  per_page?: number;
  cursor?: string | null;
}

export interface GetAdminSectionProductsResponse {
  success: boolean;
  message: string;
  summary: AdminProductsSummary;
  section: {
    id: number;
    name: string;
    network_type: AdminNetworkType;
    industry_type: AdminIndustryType;
    total_products?: number;
    categories: Array<{
      id: number;
      category_name: string;
      products_count?: number;
    }>;
  } | null;
  data: AdminProductItem[];
  pagination: {
    limit: number;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
    has_more_pages: boolean;
    total: number;
  };
}

export interface GetVerifiedIndustriesResponse {
  success: boolean;
  message: string;
  data: VerifiedIndustryOption[];
}

export interface SingleAdminProductResponse {
  success: boolean;
  message: string;
  data: AdminProductItem;
}

export interface UpdateAdminProductStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    product_id: string | null;
    product_name: string;
    status: AdminProductStatus;
    updated_at: string | null;
  };
}

export interface DeleteAdminProductResponse {
  success: boolean;
  message: string;
}

