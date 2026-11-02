import baseApiSlice from "../baseApi";

const messageSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversationList: builder.query({
      query: (params) => ({
        url: `/conversations?status=${params}`,
        method: "GET",
      }),
      providesTags: ["conversationList"],
    }),
    startConversation: builder.mutation({
      query: (userId) => ({
        url: `/conversations/with/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["conversationList"],
    }),
    getConversationMessages: builder.query({
      query: (arg: any) => {
        const { id, cursor, afterId } =
          typeof arg === "string" || typeof arg === "number"
            ? { id: arg, cursor: null }
            : (arg ?? {});
        const search = new URLSearchParams();
        if (cursor) search.set("cursor", String(cursor));
        if (afterId != null) search.set("after_id", String(afterId));
        const qs = search.toString();
        return {
          url: `/conversations/${id}/messages${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => {
        const id =
          typeof arg === "string" || typeof arg === "number" ? arg : arg?.id;
        return id != null ? [{ type: "message", id: String(id) }] : ["message"];
      },
      keepUnusedDataFor: 600,
    }),
    getUnreadMessagesCount: builder.query({
      query: () => ({
        url: `/conversations/unread-count`,
        method: "GET",
      }),
      providesTags: ["conversationList"],
    }),

    markReadMessage: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/mark-read`,
        method: "POST",
      }),
      // Reading affects unread counts/list badges, not the message history.
      invalidatesTags: ["conversationList"],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, data }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
        formData: true,
      }),
      // The message is inserted optimistically and reconciled from the response.
      // Refetching the whole history here causes a visible loading flash.
      invalidatesTags: ["conversationList"],
    }),
    markUnReadMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/mark-unread`,
        method: "POST",
      }),
      invalidatesTags: ["conversationList"],
    }),
    archiveMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["conversationList"],
    }),
    reactForeMessage: builder.mutation({
      query: ({ data, messageId }) => ({
        url: `/messages/${messageId}/react`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "message", id: String(conversationId) },
      ],
    }),
    unarchiveMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/unarchive`,
        method: "POST",
      }),
      invalidatesTags: ["conversationList"],
    }),
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        "conversationList",
        { type: "message", id: String(conversationId) },
      ],
    }),
    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        "conversationList",
        { type: "message", id: String(conversationId) },
      ],
    }),
  }),
});

export const {
  useGetConversationListQuery,
  useStartConversationMutation,
  useGetUnreadMessagesCountQuery,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useMarkReadMessageMutation,
  useSendMessageMutation,
  useMarkUnReadMessageMutation,
  useArchiveMessageMutation,
  useUnarchiveMessageMutation,
  useDeleteConversationMutation,
  useDeleteMessageMutation,
  useReactForeMessageMutation,
} = messageSlice;
