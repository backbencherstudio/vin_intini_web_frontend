import baseApiSlice from "../../baseApi";

export interface AdminPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
}

export interface InstitutionReport {
  sl_no: number;
  id: number | string;
  institution_name: string;
  is_verified: boolean;
  total_students: number;
  completed_programs: number;
  present_students: number;
}

export interface InstitutionReportsResponse {
  success: boolean;
  data: InstitutionReport[];
  summary?: {
    pending_count: number;
    verified_count: number;
  };
  pagination: AdminPagination;
}

export interface InstitutionStudent {
  sl_no: number;
  student_image: string | null;
  student_name: string | null;
  student_email: string | null;
  program: string | null;
  field: string | null;
  academic_period: string;
  status: "Present" | "Completed";
}

export interface InstitutionStudentsResponse {
  success: boolean;
  institution: { id: number | string; logo: string | null; name: string };
  data: InstitutionStudent[];
  pagination: AdminPagination;
}

export interface ContactMessage {
  sl_no: number;
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  address: string | null;
  status?: "unread" | "read" | "replied";
  admin_note?: string | null;
  created_at?: string;
  created_at_formatted?: string;
  created_at_human?: string;
  read_at?: string | null;
  replied_at?: string | null;
}

export interface ContactMessagesSummary {
  total_messages: number;
  unread_messages: number;
  read_messages: number;
  replied_messages: number;
  today_messages: number;
}

export interface ContactMessagesResponse {
  success: boolean;
  message?: string;
  data: ContactMessage[];
  summary?: ContactMessagesSummary;
  pagination: AdminPagination;
}

export interface GetContactMessagesParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ExperienceCompanyItem {
  sl_no: number;
  id: number | string;
  name: string;
  is_verified: boolean;
  total_experiences: number;
}

export interface ExperienceCompaniesResponse {
  success: boolean;
  data: ExperienceCompanyItem[];
  summary?: {
    pending_count: number;
    verified_count: number;
  };
  pagination: AdminPagination;
}

export interface AdminSkillItem {
  sl_no: number;
  id: number | string;
  name: string;
  is_verified: boolean;
  usage_count: number;
}

export interface AdminSkillsResponse {
  success: boolean;
  data: AdminSkillItem[];
  summary?: {
    pending_count: number;
    verified_count: number;
  };
  pagination: AdminPagination;
}

export const adminReportApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInstitutionReports: builder.query<
      InstitutionReportsResponse,
      { search?: string; status?: "all" | "pending" | "verified"; page?: number } | void
    >({
      query: (params) => ({ url: "/admin/institution-report", params: params ? { ...params } : undefined }),
      providesTags: ["institutionReports"],
    }),
    createInstitution: builder.mutation<
      { success: boolean; message: string; data: any },
      { name: string; is_verified?: boolean }
    >({
      query: (body) => ({
        url: "/admin/institution-report",
        method: "POST",
        body,
      }),
      invalidatesTags: ["institutionReports"],
    }),
    updateInstitutionStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; is_verified: boolean }
    >({
      query: ({ id, is_verified }) => ({
        url: `/admin/institution-report/${id}/status`,
        method: "PATCH",
        body: { is_verified },
      }),
      invalidatesTags: ["institutionReports"],
    }),
    renameInstitution: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; name: string; is_verified?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/institution-report/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["institutionReports"],
    }),
    mergeInstitution: builder.mutation<
      { success: boolean; message: string },
      { id: number | string; target_institution_id: number | string }
    >({
      query: ({ id, target_institution_id }) => ({
        url: `/admin/institution-report/${id}/merge`,
        method: "POST",
        body: { target_institution_id },
      }),
      invalidatesTags: ["institutionReports"],
    }),
    deleteInstitution: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/admin/institution-report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["institutionReports"],
    }),
    getInstitutionStudents: builder.query<InstitutionStudentsResponse, { id: number | string; search?: string; status?: "present" | "completed"; page?: number; per_page?: number }>({
      query: ({ id, ...params }) => ({ url: `/admin/institution-report/students/${id}`, params }),
    }),
    getContactMessages: builder.query<ContactMessagesResponse, GetContactMessagesParams | void>({
      query: (params) => ({ url: "/admin/contact-us", params: params ? { ...params } : undefined }),
      providesTags: ["contactMessages"],
    }),
    getContactMessageDetails: builder.query<{ success: boolean; data: ContactMessage }, number | string>({
      query: (id) => ({ url: `/admin/contact-us/${id}` }),
      providesTags: ["contactMessages"],
    }),
    markContactMessageStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; status: "unread" | "read" | "replied" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/contact-us/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["contactMessages"],
    }),
    deleteContactMessage: builder.mutation<{ success: boolean; message: string }, number | string>({
      query: (id) => ({
        url: `/admin/contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contactMessages"],
    }),
    updateContactMessageNote: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; admin_note: string }
    >({
      query: ({ id, admin_note }) => ({
        url: `/admin/contact-us/${id}/note`,
        method: "PATCH",
        body: { admin_note },
      }),
      invalidatesTags: ["contactMessages"],
    }),
    getExperienceCompanies: builder.query<
      ExperienceCompaniesResponse,
      { search?: string; status?: "all" | "pending" | "verified"; page?: number } | void
    >({
      query: (params) => ({
        url: "/admin/experience-companies",
        params: params ? { ...params } : undefined,
      }),
      providesTags: ["experienceCompanies"],
    }),
    createExperienceCompany: builder.mutation<
      { success: boolean; message: string; data: any },
      { name: string; is_verified?: boolean }
    >({
      query: (body) => ({
        url: "/admin/experience-companies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["experienceCompanies"],
    }),
    updateExperienceCompanyStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; is_verified: boolean }
    >({
      query: ({ id, is_verified }) => ({
        url: `/admin/experience-companies/${id}/status`,
        method: "PATCH",
        body: { is_verified },
      }),
      invalidatesTags: ["experienceCompanies"],
    }),
    renameExperienceCompany: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; name: string; is_verified?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/experience-companies/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["experienceCompanies"],
    }),
    mergeExperienceCompany: builder.mutation<
      { success: boolean; message: string },
      { id: number | string; target_company_id: number | string }
    >({
      query: ({ id, target_company_id }) => ({
        url: `/admin/experience-companies/${id}/merge`,
        method: "POST",
        body: { target_company_id },
      }),
      invalidatesTags: ["experienceCompanies"],
    }),
    deleteExperienceCompany: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/admin/experience-companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["experienceCompanies"],
    }),
    getAdminSkills: builder.query<
      AdminSkillsResponse,
      { search?: string; status?: "all" | "pending" | "verified"; page?: number } | void
    >({
      query: (params) => ({
        url: "/admin/skills",
        params: params ? { ...params } : undefined,
      }),
      providesTags: ["adminSkills"],
    }),
    createAdminSkill: builder.mutation<
      { success: boolean; message: string; data: any },
      { name: string; is_verified?: boolean }
    >({
      query: (body) => ({
        url: "/admin/skills",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adminSkills"],
    }),
    updateAdminSkillStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; is_verified: boolean }
    >({
      query: ({ id, is_verified }) => ({
        url: `/admin/skills/${id}/status`,
        method: "PATCH",
        body: { is_verified },
      }),
      invalidatesTags: ["adminSkills"],
    }),
    renameAdminSkill: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: number | string; name: string; is_verified?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/skills/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["adminSkills"],
    }),
    mergeAdminSkill: builder.mutation<
      { success: boolean; message: string },
      { id: number | string; target_skill_id: number | string }
    >({
      query: ({ id, target_skill_id }) => ({
        url: `/admin/skills/${id}/merge`,
        method: "POST",
        body: { target_skill_id },
      }),
      invalidatesTags: ["adminSkills"],
    }),
    deleteAdminSkill: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/admin/skills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["adminSkills"],
    }),
  }),
});

export const {
  useGetInstitutionReportsQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionStatusMutation,
  useRenameInstitutionMutation,
  useMergeInstitutionMutation,
  useDeleteInstitutionMutation,
  useGetInstitutionStudentsQuery,
  useGetExperienceCompaniesQuery,
  useCreateExperienceCompanyMutation,
  useUpdateExperienceCompanyStatusMutation,
  useRenameExperienceCompanyMutation,
  useMergeExperienceCompanyMutation,
  useDeleteExperienceCompanyMutation,
  useGetAdminSkillsQuery,
  useCreateAdminSkillMutation,
  useUpdateAdminSkillStatusMutation,
  useRenameAdminSkillMutation,
  useMergeAdminSkillMutation,
  useDeleteAdminSkillMutation,
  useGetContactMessagesQuery,
  useGetContactMessageDetailsQuery,
  useMarkContactMessageStatusMutation,
  useDeleteContactMessageMutation,
  useUpdateContactMessageNoteMutation,
} = adminReportApi;
