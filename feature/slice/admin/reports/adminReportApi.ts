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
  total_students: number;
  completed_programs: number;
  present_students: number;
}

export interface InstitutionReportsResponse {
  success: boolean;
  data: InstitutionReport[];
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
}

export interface ContactMessagesResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: AdminPagination;
}

export const adminReportApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInstitutionReports: builder.query<InstitutionReportsResponse, { search?: string; page?: number } | void>({
      query: (params) => ({ url: "/admin/institution-report", params: params ? { ...params } : undefined }),
    }),
    getInstitutionStudents: builder.query<InstitutionStudentsResponse, { id: number | string; search?: string; status?: "present" | "completed"; page?: number; per_page?: number }>({
      query: ({ id, ...params }) => ({ url: `/admin/institution-report/students/${id}`, params }),
    }),
    getContactMessages: builder.query<ContactMessagesResponse, { search?: string; page?: number; per_page?: number } | void>({
      query: (params) => ({ url: "/admin/contact-us", params: params ? { ...params } : undefined }),
    }),
  }),
});

export const { useGetInstitutionReportsQuery, useGetInstitutionStudentsQuery, useGetContactMessagesQuery } = adminReportApi;
