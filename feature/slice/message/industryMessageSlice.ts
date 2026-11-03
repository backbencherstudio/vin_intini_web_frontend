import baseApiSlice from "../baseApi";

const industryMessageSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIndustryConversationList: builder.query({
      query: (params: { status?: string; mode?: string; search?: string } | string | undefined) => {
        let status = "all";
        let mode = "industry";
        let search = "";

        if (typeof params === "string") {
          status = params;
        } else if (params) {
          status = params.status ?? "all";
          mode = params.mode ?? "industry";
          search = params.search ?? "";
        }

        const qs = new URLSearchParams();
        if (status) qs.set("status", status);
        if (mode) qs.set("mode", mode);
        if (search) qs.set("search", search);

        return {
          url: `/industry-conversations?${qs.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["industryConversationList"],
    }),

    startIndustryConversationWithUser: builder.mutation({
      query: (userId: number | string) => ({
        url: `/industry-conversations/with-user/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    startIndustryConversationWithIndustry: builder.mutation({
      query: (industryId: number | string) => ({
        url: `/industry-conversations/with-industry/${industryId}`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    getIndustryConversationMessages: builder.query({
      query: (arg: any) => {
        const { id, cursor, afterId } =
          typeof arg === "string" || typeof arg === "number"
            ? { id: arg, cursor: null, afterId: null }
            : (arg ?? {});
        const search = new URLSearchParams();
        if (cursor) search.set("cursor", String(cursor));
        if (afterId != null) search.set("after_id", String(afterId));
        const qs = search.toString();
        return {
          url: `/industry-conversations/${id}/messages${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => {
        const id =
          typeof arg === "string" || typeof arg === "number" ? arg : arg?.id;
        return id != null ? [{ type: "industryMessage", id: String(id) }] : ["industryMessage"];
      },
      keepUnusedDataFor: 600,
    }),

    getIndustryUnreadMessagesCount: builder.query({
      query: () => ({
        url: `/industry-conversations/unread-count`,
        method: "GET",
      }),
      providesTags: ["industryConversationList"],
    }),

    markReadIndustryMessage: builder.mutation({
      query: (conversationId: number | string) => ({
        url: `/industry-conversations/${conversationId}/mark-read`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    sendIndustryMessage: builder.mutation({
      query: ({ conversationId, data }: { conversationId: number | string; data: FormData }) => ({
        url: `/industry-conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    markUnReadIndustryMessage: builder.mutation({
      query: (conversationId: number | string) => ({
        url: `/industry-conversations/${conversationId}/mark-unread`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    archiveIndustryMessage: builder.mutation({
      query: (conversationId: number | string) => ({
        url: `/industry-conversations/${conversationId}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    unarchiveIndustryMessage: builder.mutation({
      query: (conversationId: number | string) => ({
        url: `/industry-conversations/${conversationId}/unarchive`,
        method: "POST",
      }),
      invalidatesTags: ["industryConversationList"],
    }),

    reactIndustryMessage: builder.mutation({
      query: ({ data, messageId }: { data: { reaction: string }; messageId: number | string; conversationId?: number | string }) => ({
        url: `/industry-messages/${messageId}/react`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "industryMessage", id: String(conversationId) },
      ],
    }),

    deleteIndustryConversation: builder.mutation({
      query: (conversationId: number | string) => ({
        url: `/industry-conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        "industryConversationList",
        { type: "industryMessage", id: String(conversationId) },
      ],
    }),

    deleteIndustryMessage: builder.mutation({
      query: ({ messageId }: { messageId: number | string; conversationId?: number | string }) => ({
        url: `/industry-messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        "industryConversationList",
        { type: "industryMessage", id: String(conversationId) },
      ],
    }),

    searchIndustryUsers: builder.query({
      query: (search: string) => ({
        url: `/industry-conversations/search-users?query=${encodeURIComponent(search)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetIndustryConversationListQuery,
  useStartIndustryConversationWithUserMutation,
  useStartIndustryConversationWithIndustryMutation,
  useGetIndustryConversationMessagesQuery,
  useLazyGetIndustryConversationMessagesQuery,
  useGetIndustryUnreadMessagesCountQuery,
  useMarkReadIndustryMessageMutation,
  useSendIndustryMessageMutation,
  useMarkUnReadIndustryMessageMutation,
  useArchiveIndustryMessageMutation,
  useUnarchiveIndustryMessageMutation,
  useReactIndustryMessageMutation,
  useDeleteIndustryConversationMutation,
  useDeleteIndustryMessageMutation,
  useLazySearchIndustryUsersQuery,
} = industryMessageSlice;

