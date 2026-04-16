import baseApiSlice from "../baseApi";

const authSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({  
                url: "/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],  
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }), 
            invalidatesTags: ["User"],
        }),
        getCurrentUser: builder.query({ 
            query: () => ({
                url: "/me",
                method: "GET",  
            }),
            providesTags: ["User"],
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } = authSlice;   