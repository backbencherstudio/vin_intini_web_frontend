export type IndustryType = "biotechnology" | "psychotropics" | string;

export interface CategoryItem {
  id: number;
  section_id?: number;
  category_name: string;
  is_active?: boolean;
  sort_order?: number;
  products_count?: number;
}

export interface CategorySection {
  id: number;
  network_type?: string;
  industry_type: IndustryType;
  name: string;
  is_active?: boolean;
  sort_order?: number;
  categories: CategoryItem[];
  products_count?: number;
  categories_count?: number;
}

export interface CategorySummary {
  total_sections: number;
  biotechnology_sections: number;
  psychotropics_sections: number;
  total_subcategories: number;
}

export interface CategoryPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

export interface NetworkCategoryData {
  network: string;
  sections: CategorySection[];
  pagination: CategoryPagination;
  summary?: CategorySummary;
}

export interface GetCategorySectionsResponse {
  success: boolean;
  message: string;
  data: NetworkCategoryData;
  summary?: CategorySummary;
}

export interface GetCategorySectionsQueryParams {
  type?: IndustryType | "";
  search?: string;
  per_page?: number;
  page?: number;
  [key: string]: unknown;
}

export interface GetCategorySectionsParams {
  network?: string;
  query?: GetCategorySectionsQueryParams;
}

export interface GetPsychologySectionsParams {
  query?: GetCategorySectionsQueryParams;
}

export interface GetNeuroscienceSectionsParams {
  query?: GetCategorySectionsQueryParams;
}

// ============ Section CRUD Types ============

export interface CreateSectionPayload {
  industry_type: IndustryType;
  name: string;
}

export interface CreateSectionArgs {
  network?: string;
  body: CreateSectionPayload;
}

export interface CreateSectionResponse {
  success: boolean;
  message?: string;
  data?: CategorySection;
}

export interface UpdateSectionPayload {
  industry_type: IndustryType;
  name: string;
}

export interface UpdateSectionArgs {
  network?: string;
  id: number | string;
  body: UpdateSectionPayload;
}

export interface UpdateSectionResponse {
  success: boolean;
  message?: string;
  data?: CategorySection;
}

export interface DeleteSectionArgs {
  id: number | string;
}

export interface DeleteSectionResponse {
  success: boolean;
  message?: string;
}

export interface ReorderCategorySectionsPayload {
  section_ids: (number | string)[];
}

export interface ToggleCategorySectionStatusArgs {
  id: number | string;
  is_active?: boolean;
}

export interface ToggleCategorySectionStatusResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    is_active: boolean;
  };
}

// ============ Category / Subcategory Tab CRUD Types ============

export interface CreateCategoryTabPayload {
  section_id: number | string;
  category_name: string;
}

export interface UpdateCategoryTabPayload {
  category_name?: string;
  is_active?: boolean;
}

export interface ReorderCategoryTabsPayload {
  category_ids: (number | string)[];
}

export interface CreateCategoryTabArgs {
  section_id?: number | string;
  body?: UpdateCategoryTabPayload;
  category_name?: string;
}

export interface UpdateCategoryTabArgs {
  id: number | string;
  body?: UpdateCategoryTabPayload;
  category_name?: string;
}

export interface CreateCategoryTabResponse {
  success: boolean;
  message?: string;
  data?: CategoryItem;
}

export interface UpdateCategoryTabResponse {
  success: boolean;
  message?: string;
  data?: CategoryItem;
}

export interface DeleteCategoryTabResponse {
  success: boolean;
  message?: string;
}
