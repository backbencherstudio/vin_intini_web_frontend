import baseApiSlice from "../../baseApi";
import {
  CancelSubscriptionResponse,
  CreatePlanResponse,
  DeletePlanResponse,
  GetPlansResponse,
  GetSubscriptionsParams,
  GetSubscriptionsResponse,
  GetTransactionDetailResponse,
  GetTransactionsParams,
  GetTransactionsResponse,
  GetTransactionStatsParams,
  GetTransactionStatusResponse,
  UpdatePlanArgs,
  PlanPayload,
  UpdatePlanResponse,
  GetPlanFeaturesResponse,
} from "./subscriptionType";

const subscriptionSlice = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMySubscribers: builder.query<
      GetSubscriptionsResponse,
      GetSubscriptionsParams
    >({
      query: ({ query }) => ({
        url: "/admin/subscriptions",
        method: "GET",
        params: query,
      }),
      providesTags: ["subscription"],
    }),

    cancelSubscription: builder.mutation<
      CancelSubscriptionResponse,
      { id: number | string }
    >({
      query: ({ id }) => ({
        url: `/admin/subscriptions/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["subscription"],
    }),

    // ============   Transaction  ============
    getTransactionStats: builder.query<
      GetTransactionStatusResponse,
      GetTransactionStatsParams | void
    >({
      query: (params) => ({
        url: `/admin/transactions/overview`,
        method: "GET",
        params: params ? { ...params } : undefined,
      }),
      providesTags: ["subscription", "boosting"],
    }),
    getTransactionList: builder.query<
      GetTransactionsResponse,
      GetTransactionsParams
    >({
      query: ({ query }: GetTransactionsParams) => ({
        url: `/admin/transactions`,
        method: "GET",
        params: query,
      }),
      providesTags: ["subscription", "boosting"],
    }),
    getTransactionDetail: builder.query<
      GetTransactionDetailResponse,
      number | string
    >({
      query: (id) => ({
        url: `/admin/transactions/${id}`,
        method: "GET",
      }),
      providesTags: ["subscription", "boosting"],
    }),

    // ============   Plan and Pricing  ============
    getPlans: builder.query<GetPlansResponse, void>({
      query: () => ({
        url: "/admin/plans",
        method: "GET",
      }),
      providesTags: ["plan"],
    }),
    createPlan: builder.mutation<CreatePlanResponse, PlanPayload>({
      query: (body) => ({
        url: "/admin/plans/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["plan"],
    }),
    updatePlan: builder.mutation<UpdatePlanResponse, UpdatePlanArgs>({
      query: ({ id, body }) => ({
        url: `/admin/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["plan"],
    }),
    deactivePlan: builder.mutation<DeletePlanResponse, { id: number | string }>(
      {
        query: ({ id }) => ({
          url: `/admin/plans/${id}/status`,
          method: "PATCH",
        }),
        invalidatesTags: ["plan"],
      },
    ),
    deletePlan: builder.mutation<DeletePlanResponse, number | string>({
      query: (id) => ({
        url: `/admin/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["plan"],
    }),
    reorderPlans: builder.mutation<
      { success: boolean; message?: string },
      number[]
    >({
      query: (ids) => ({
        url: "/admin/plans/reorder",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["plan"],
    }),

    // get all features
    getPlanFeatures: builder.query<GetPlanFeaturesResponse, void>({
      query: () => ({
        url: "/admin/plan-features",
        method: "GET",
      }),
      providesTags: ["plan"],
    }),
  }),
});

export const {
  useGetMySubscribersQuery,
  useCancelSubscriptionMutation,
  useGetTransactionStatsQuery,
  useGetTransactionListQuery,
  useGetTransactionDetailQuery,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeactivePlanMutation,
  useDeletePlanMutation,
  useReorderPlansMutation,
  useGetPlanFeaturesQuery,
} = subscriptionSlice;
