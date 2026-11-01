import baseApiSlice from "../../baseApi";
import {
  AdminUserDetailsResponse,
  GetLeaveRequestsParams,
  GetLeaveRequestsResponse,
  GetUsersParams,
  GetUsersResponse,
  ToggleUserSuspendResponse,
} from "./userTypes";

const userApi = baseApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersParams | void>({
      query: (params) => ({
        url: "/admin/user-manage/users",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["User"],
    }),
    getAdminUserDetails: builder.query<AdminUserDetailsResponse, number | string>({
      query: (userId) => ({
        url: `/admin/user-manage/users/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
      ],
    }),
    toggleUserSuspend: builder.mutation<
      ToggleUserSuspendResponse,
      { userId: number; is_suspended: boolean }
    >({
      query: ({ userId, is_suspended }) => ({
        url: `/admin/user-manage/users/${userId}/toggle-suspend`,
        method: "POST",
        body: { is_suspended },
      }),
      invalidatesTags: ["User"],
    }),
    getLeaveRequests: builder.query<
      GetLeaveRequestsResponse,
      GetLeaveRequestsParams | void
    >({
      query: (params) => ({
        url: "/admin/user-manage/leave-request",
        method: "GET",
        params: params ? params.query : undefined,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAdminUserDetailsQuery,
  useToggleUserSuspendMutation,
  useGetLeaveRequestsQuery,
} = userApi;
export default userApi;

