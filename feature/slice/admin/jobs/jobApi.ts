import baseApiSlice from "../../baseApi";
import type {
  AdminJobStatus,
  ApplicantStage,
  CreateAdminJobPayload,
  GetAdminJobsParams,
  GetAdminJobsResponse,
  GetJobApplicantsParams,
  GetJobApplicantsResponse,
  GetVerifiedIndustriesResponse,
  SingleAdminJobResponse,
  UpdateAdminJobPayload,
  UpdateApplicantStatusPayload,
  UpdateApplicantStatusResponse,
} from "./jobTypes";

const adminJobsApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminJobs: builder.query<GetAdminJobsResponse, GetAdminJobsParams | void>({
      query: (params) => {
        const p = params || {};
        return {
          url: "/admin/jobs",
          method: "GET",
          params: {
            ...(p.status && p.status !== "all" ? { status: p.status } : {}),
            ...(p.network_type && p.network_type !== "all" ? { network_type: p.network_type } : {}),
            ...(p.industry_id ? { industry_id: p.industry_id } : {}),
            ...(p.work_mode && p.work_mode !== "all" ? { work_mode: p.work_mode } : {}),
            ...(p.state_id && p.state_id !== "all" ? { state_id: p.state_id } : {}),
            ...(p.city_id && p.city_id !== "all" ? { city_id: p.city_id } : {}),
            ...(p.search?.trim() ? { search: p.search.trim() } : {}),
            ...(p.page ? { page: p.page } : {}),
            ...(p.per_page ? { per_page: p.per_page } : {}),
          },
        };
      },
      providesTags: ["adminJobs"],
    }),

    getVerifiedJobIndustries: builder.query<
      GetVerifiedIndustriesResponse,
      { search?: string; industry_type?: string } | void
    >({
      query: (params) => ({
        url: "/admin/jobs/verified-industries",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["partner"],
    }),

    getAdminJobById: builder.query<SingleAdminJobResponse, number | string>({
      query: (id) => ({
        url: `/admin/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "adminJobs", id }],
    }),

    createAdminJob: builder.mutation<SingleAdminJobResponse, CreateAdminJobPayload>({
      query: (body) => ({
        url: "/admin/jobs/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adminJobs", "Job"],
    }),

    updateAdminJob: builder.mutation<SingleAdminJobResponse, UpdateAdminJobPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/jobs/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => ["adminJobs", { type: "adminJobs", id }, "Job"],
    }),

    updateAdminJobStatus: builder.mutation<
      SingleAdminJobResponse,
      { id: number | string; status: AdminJobStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/jobs/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_res, _err, { id }) => ["adminJobs", { type: "adminJobs", id }, "Job"],
    }),

    rejectAdminJob: builder.mutation<
      SingleAdminJobResponse,
      { id: number | string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/jobs/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_res, _err, { id }) => ["adminJobs", { type: "adminJobs", id }, "Job"],
    }),

    deleteAdminJob: builder.mutation<{ success: boolean; message: string }, number | string>({
      query: (id) => ({
        url: `/admin/jobs/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["adminJobs", "Job"],
    }),

    getAdminJobApplicants: builder.query<GetJobApplicantsResponse, GetJobApplicantsParams>({
      query: ({ jobId, status, search, page, per_page }) => ({
        url: `/admin/jobs/${jobId}/applicants`,
        method: "GET",
        params: {
          ...(status && status !== "all" ? { status } : {}),
          ...(search?.trim() ? { search: search.trim() } : {}),
          ...(page ? { page } : {}),
          ...(per_page ? { per_page } : {}),
        },
      }),
      providesTags: (_res, _err, { jobId }) => [
        "adminJobApplicants",
        { type: "adminJobApplicants", id: jobId },
      ],
    }),

    updateAdminApplicantStatus: builder.mutation<
      UpdateApplicantStatusResponse,
      UpdateApplicantStatusPayload
    >({
      query: ({ jobId, applicationId, status }) => ({
        url: `/admin/jobs/${jobId}/applicants/${applicationId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_res, _err, { jobId }) => [
        "adminJobApplicants",
        { type: "adminJobApplicants", id: jobId },
        "adminJobs",
      ],
    }),
  }),
});

export const {
  useGetAdminJobsQuery,
  useGetVerifiedJobIndustriesQuery,
  useGetAdminJobByIdQuery,
  useCreateAdminJobMutation,
  useUpdateAdminJobMutation,
  useUpdateAdminJobStatusMutation,
  useRejectAdminJobMutation,
  useDeleteAdminJobMutation,
  useGetAdminJobApplicantsQuery,
  useUpdateAdminApplicantStatusMutation,
} = adminJobsApi;

export default adminJobsApi;
