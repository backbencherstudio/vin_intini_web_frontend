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
      query: (search) => ({
        url: `/connections${search ? `?search=${search}` : ""}`,
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
        method: "POST",
      }),
      invalidatesTags: ["connect"],
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
  useGetMyConnectionsQuery,
  useGetMyConnectionSuggestionsQuery,
  useSendRequestMutation,
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useRequestRejectMutation,
} = connectSlice;
