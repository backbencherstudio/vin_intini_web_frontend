import baseApiSlice from "../baseApi";

const connectSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query({
      query: () => ({
        url: "/connections/requests",
        method: "GET",
      }),
    }),
    getMyConnections: builder.query({
      query: () => ({
        url: "/connections",
        method: "GET",
      }),
    }),
    getMyConnectionSuggestions: builder.query({
      query: () => ({
        url: "/connections/suggestions",
        method: "GET",
      }),
    }),
    sendRequest: builder.mutation({
      query: ({ payload }) => ({
        url: "/connections/request",
        method: "POST",
        body: payload,
      }),
    }),
    removeRequest: builder.mutation({
      query: ({ id }) => ({
        url: `/connections/${id}/remove`,
        method: "POST",
      }),
    }),
    requestAccept: builder.mutation({
      query: ({ id }) => ({
        url: `/connections/requests/${id}/accept`,
        method: "POST",
      }),
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
  useGetMyConnectionsQuery,
  useGetMyConnectionSuggestionsQuery,
  useSendRequestMutation,
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useRequestRejectMutation,
} = connectSlice;
