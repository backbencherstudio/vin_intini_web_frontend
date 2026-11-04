import baseApiSlice from "../baseApi";

const connectSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query({
      query: ({ query }) => ({
        url: `/connections/requests${query}`,
        method: "GET",
      }),
      providesTags: ["connect"],
    }),
    getSentConnections: builder.query({
      query: (arg?: { query?: string }) => {
        const query = arg?.query || "";
        return {
          url: `/connections/sent-requests${query ? (query.startsWith("?") ? query : `?${query}`) : ""}`,
          method: "GET",
        };
      },
      providesTags: ["connect"],
    }),
    getMyConnections: builder.query({
      query: ({ query }) => ({
        url: `/connections${query}`,
        method: "GET",
      }),
      providesTags: ["connect"],
    }),
    getMyConnectionSuggestions: builder.query({
      query: () => ({
        url: "/connections/suggestions",
        method: "GET",
      }),
      providesTags: ["connect"],
    }),

    sendRequest: builder.mutation({
      query: ({ payload }) => ({
        url: "/connections/request",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["connect"],
    }),
    removeRequest: builder.mutation({
      query: ({ id }) => ({
        url: `/connections/${id}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: ["connect", "User"],
    }),
    requestAccept: builder.mutation({
      query: ({ id }) => ({
        url: `/connections/requests/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["connect"],
    }),
    requestReject: builder.mutation({
      query: ({ id }) => ({
        url: `/connections/requests/${id}/ignore`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useGetSentConnectionsQuery,
  useGetMyConnectionsQuery,
  useGetMyConnectionSuggestionsQuery,
  useSendRequestMutation,
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useRequestRejectMutation,
} = connectSlice;

export const useCancelSentRequestMutation = useRemoveRequestMutation;
