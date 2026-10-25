import baseApiSlice from "../../baseApi";
import {
  GetLeaveRequestsParams,
  GetLeaveRequestsResponse,
  GetUsersParams,
  GetUsersResponse,
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
    toggleUserSuspend: builder.mutation<unknown, number>({
      query: (userId) => ({
        url: `/admin/user-manage/users/${userId}/toggle-suspend`,
        method: "POST",
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
  useToggleUserSuspendMutation,
  useGetLeaveRequestsQuery,
} = userApi;
export default userApi;

