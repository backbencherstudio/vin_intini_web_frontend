import baseApiSlice from "../baseApi";

const connectSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
});
