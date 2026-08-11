import baseApiSlice from "../baseApi";

const messageSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversationList: builder.query({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["message"],
    }),
    startConversation: builder.mutation({
      query: (userId) => ({
        url: `/conversations/with/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
    getConversationMessages: builder.query({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),
    markReadMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/mark-read`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content, attachments }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content, attachments },
      }),
      invalidatesTags: ["message"],
    }),
    markUnReadMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/mark-unread`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
    archiveMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
    unarchiveMessage: builder.mutation({
      query: (messageId) => ({
        url: `/conversations/${messageId}/unarchive`,
        method: "POST",
      }),
      invalidatesTags: ["message"],
    }),
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"],
    }),
  }),
});

export const {
  useGetConversationListQuery,
  useStartConversationMutation,
  useGetConversationMessagesQuery,
  useMarkReadMessageMutation,
  useSendMessageMutation,
  useMarkUnReadMessageMutation,
  useArchiveMessageMutation,
  useUnarchiveMessageMutation,
  useDeleteConversationMutation,
  useDeleteMessageMutation,
} = messageSlice;
