export type AdminJobStatus =
  | "published"
  | "pending"
  | "draft"
  | "rejected"
  | "archive"
  | "expired";

export type AdminJobNetworkType = "psychology" | "neuroscience";
export type AdminJobWorkMode = "remote" | "onsite" | "hybrid";

export type ApplicantStage =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "hired"
  | "rejected";

export interface VerifiedIndustryOption {
  id: number;
  name: string;
  slug: string;
  industry: string | null;
  logo_url: string | null;
  website: string | null;
  owner: {
    id: number;
    full_name: string;
    email: string;
  } | null;
}

export interface AdminJobIndustry {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  industry?: string | null;
}

export interface AdminJobCreator {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  profile_image?: string | null;
}

export interface AdminJobItem {
  id: number;
  job_id: string;
  industry_id: number;
  created_by?: number | null;
  job_title: string;
  slug: string;
  position?: string | null;
  category?: string | null;
  sub_category?: string | null;
  job_description: string;
  work_mode: AdminJobWorkMode | string;
  employment_type: string;
  level?: string | null;
  experience?: string | null;
  state_id?: number | null;
  city_id?: number | null;
  state?: { id: number; name: string } | null;
  city?: { id: number; name: string } | null;
  email: string;
  phone_number?: string | null;
  website?: string | null;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  salary_type?: string | null;
  location_url?: string | null;
  network_type?: AdminJobNetworkType | string | null;
  employment_offering?: string | null;
  tags?: string[] | string | null;
  announcement_start_date?: string | null;
  announcement_end_date?: string | null;
  status: AdminJobStatus | string;
  rejection_reason?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  applications_count?: number;
  industry?: AdminJobIndustry | null;
  creator?: AdminJobCreator | null;
}

export interface AdminJobsSummary {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  expired: number;
  draft: number;
}

export interface AdminJobsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetAdminJobsParams {
  status?: string;
  network_type?: string;
  industry_id?: number;
  work_mode?: string;
  state_id?: number | string;
  city_id?: number | string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface GetAdminJobsResponse {
  success: boolean;
  summary: AdminJobsSummary;
  data: AdminJobItem[];
  meta: AdminJobsMeta;
}

export interface SingleAdminJobResponse {
  success: boolean;
  message?: string;
  data: AdminJobItem;
  application_stats?: {
    total: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    interviewed: number;
    offered: number;
    hired: number;
    rejected: number;
  };
}

export interface GetVerifiedIndustriesResponse {
  success: boolean;
  message: string;
  data: VerifiedIndustryOption[];
}

export interface CreateAdminJobPayload {
  industry_id: number;
  job_title: string;
  position?: string;
  category?: string;
  sub_category?: string;
  job_description: string;
  work_mode: string;
  employment_type: string;
  level?: string;
  experience?: string;
  state_id?: number | null;
  city_id?: number | null;
  email: string;
  phone_number?: string | null;
  website?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_type?: string | null;
  location_url?: string | null;
  network_type?: AdminJobNetworkType | string;
  employment_offering?: string | null;
  tags?: string | string[] | null;
  announcement_start_date?: string | null;
  announcement_end_date?: string | null;
  status?: AdminJobStatus | string;
}

export interface UpdateAdminJobPayload extends Partial<CreateAdminJobPayload> {
  id: number | string;
}

export interface ApplicantItem {
  id: number;
  application_id: string;
  job_id: number;
  applicant_id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  current_position?: string | null;
  experiences?: Array<{
    title?: string;
    company?: string;
    years?: string | number;
    description?: string;
  }> | string | null;
  cover_letter?: string | null;
  about_yourself?: string | null;
  skills?: string[] | string | null;
  expected_salary?: number | string | null;
  status: ApplicantStage;
  resume_path?: string | null;
  resume_url?: string | null;
  created_at: string;
  updated_at?: string;
  applicant?: {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    email?: string | null;
    profile_image?: string | null;
  } | null;
}

export interface JobApplicantsStats {
  all: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  hired: number;
  rejected: number;
}

export interface GetJobApplicantsResponse {
  success: boolean;
  job: {
    id: number;
    job_id: string;
    job_title: string;
    position?: string | null;
    work_mode: string;
    industry?: AdminJobIndustry | null;
  };
  stats: JobApplicantsStats;
  data: ApplicantItem[];
  meta: AdminJobsMeta;
}

export interface GetJobApplicantsParams {
  jobId: number | string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UpdateApplicantStatusPayload {
  jobId: number | string;
  applicationId: number | string;
  status: ApplicantStage;
}

export interface UpdateApplicantStatusResponse {
  success: boolean;
  message: string;
  data: ApplicantItem;
}

