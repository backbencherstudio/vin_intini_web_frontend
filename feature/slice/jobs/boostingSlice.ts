import baseApiSlice from "../baseApi";

const boostingSlice = baseApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBoostingPlan: build.query({
      query: () => ({
        url: `/industry/boost-packages`,
        method: "GET",
      }),
      providesTags: ["boosting"],
    }),
    getBoostingAdvertisementCampaign: build.query({
      query: (params) => ({
        url: `/industry/boost-campaigns`,
        method: "GET",
        params,
      }),
      providesTags: ["boosting"],
    }),
    getBoostingPosts: build.query({
      query: (params) => ({
        url: `/industry/boost-campaigns`,
        method: "GET",
        params,
      }),
      providesTags: ["boosting"],
    }),
    getBoostOrderSummary: build.query({
      query: ({ productId, entityType = "products", ...params }) => ({
        url:
          entityType === "publications"
            ? `/publications/${productId}/boost/order-summary`
            : `/industry/products/${productId}/boost/order-summary`,
        method: "GET",
        params,
      }),
    }),
    sendBoostOtp: build.mutation({
      query: ({ productId, entityType = "products", ...body }) => ({
        url:
          entityType === "publications"
            ? `/publications/${productId}/boost/send-otp`
            : `/industry/products/${productId}/boost/send-otp`,
        method: "POST",
        body,
      }),
    }),
    resendBoostOtp: build.mutation({
      query: ({ productId, entityType = "products", ...body }) => ({
        url:
          entityType === "publications"
            ? `/publications/${productId}/boost/resend-otp`
            : `/industry/products/${productId}/boost/resend-otp`,
        method: "POST",
        body,
      }),
    }),
    pauseBoostingCampaign: build.mutation({
      query: (boostId: string | number) => ({
        url: `/industry/boost/campaigns/${boostId}/pause`,
        method: "POST",
      }),
      invalidatesTags: ["boosting", "Advertisement", "publication"],
    }),
    resumeBoostingCampaign: build.mutation({
      query: (boostId: string | number) => ({
        url: `/industry/boost/campaigns/${boostId}/resume`,
        method: "POST",
      }),
      invalidatesTags: ["boosting", "Advertisement", "publication"],
    }),
    purchaseBoost: build.mutation({
      query: ({ productId, entityType = "products", ...body }) => ({
        url:
          entityType === "publications"
            ? `/publications/${productId}/boost/purchase`
            : `/industry/products/${productId}/boost/purchase`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["boosting", "Advertisement", "publication"],
    }),
    confirmBoost: build.mutation({
      query: ({ productId, entityType = "products", ...body }) => ({
        url:
          entityType === "publications"
            ? `/publications/${productId}/boost/confirm`
            : `/industry/products/${productId}/boost/confirm`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["boosting", "Advertisement", "publication"],
    }),
    getPublicationBoostDetails: build.query({
      query: (id: string | number) => ({
        url: `/publications/${id}/details`,
        method: "GET",
      }),
      providesTags: ["publication"],
    }),
  }),
});

export const {
  useGetBoostingPlanQuery,
  useGetBoostingPostsQuery,
  useGetBoostOrderSummaryQuery,
  useGetBoostingAdvertisementCampaignQuery,
  usePauseBoostingCampaignMutation,
  useResumeBoostingCampaignMutation,
  useLazyGetBoostOrderSummaryQuery,
  useSendBoostOtpMutation,
  useResendBoostOtpMutation,
  usePurchaseBoostMutation,
  useConfirmBoostMutation,
  useGetPublicationBoostDetailsQuery,
} = boostingSlice;

