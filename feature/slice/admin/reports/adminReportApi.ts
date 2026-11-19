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

export const adminReportApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInstitutionReports: builder.query<InstitutionReportsResponse, { search?: string; page?: number } | void>({
      query: (params) => ({ url: "/admin/institution-report", params: params ? { ...params } : undefined }),
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
  }),
});

export const {
  useGetInstitutionReportsQuery,
  useGetInstitutionStudentsQuery,
  useGetContactMessagesQuery,
  useGetContactMessageDetailsQuery,
  useMarkContactMessageStatusMutation,
  useDeleteContactMessageMutation,
  useUpdateContactMessageNoteMutation,
} = adminReportApi;
