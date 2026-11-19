export interface StateItem {
  id: number;
  name: string;
  code: string;
  slug: string;
  cities_count?: number;
}

export interface CityItem {
  id: number;
  state_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  industry_job_posts_count?: number;
  user_job_preferences_count?: number;
  state?: StateItem;
}

export interface GetCitiesParams {
  page?: number;
  per_page?: number;
  search?: string;
  state_id?: number | string;
  sort_by?: "name" | "jobs_count" | "state" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface GetCitiesResponse {
  success: boolean;
  message: string;
  data: CityItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  summary: {
    total_cities: number;
    total_states: number;
  };
}

export interface GetStatesResponse {
  success: boolean;
  message: string;
  data: StateItem[];
}

export interface CreateCityPayload {
  state_id: number;
  name: string;
}

export interface UpdateCityPayload {
  id: number;
  state_id?: number;
  name: string;
}

export interface CityActionResponse {
  success: boolean;
  message: string;
  data?: CityItem;
}
