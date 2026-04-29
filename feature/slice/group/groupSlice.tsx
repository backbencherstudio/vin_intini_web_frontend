import baseApiSlice from "../baseApi";

const groupSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyGroups: builder.query({
      query: () => ({
        url: "/groups/my-groups",
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    getSuggestionGroups: builder.query({
      query: () => ({
        url: "/groups-suggestions",
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    getMyJoinedGroups: builder.query({
      query: () => ({
        url: "/my-joined-groups",
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    getMyCreatedGroups: builder.query({
      query: () => ({
        url: "/my-created-groups",
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    getViewByIdGroup: builder.query({
      query: ({ id }) => ({
        url: `/group-show/${id}`,
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    getInviteUsersGroup: builder.query({
      query: ({ id }) => ({
        url: `/group-invite-users/${id}`,
        method: "GET",
      }),
      providesTags: ["group"],
    }),
    joinGroup: builder.mutation({
      query: (groupId) => ({
        url: `/group/join`,
        method: "POST",
        body: groupId,
      }),
      invalidatesTags: ["group"],
    }),
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/group/leave`,
        method: "POST",
        body: groupId,
      }),
      invalidatesTags: ["group"],
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: `/group-create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["group"],
    }),
    groupUpdate: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `/group-update/${groupId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["group"],
    }),
    groupInviteUser: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `/group-invite-user/${groupId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["group"],
    }),
    groupLogoUpdate: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `/group-images/${groupId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["group"],
    }),
    toggleGroupNotification: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `/group/${groupId}/toggle-notification`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["group"],
    }),
    groupBanUser: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `/group/${groupId}/ban/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["group"],
    }),
  }),
});

export const {
  useGetMyCreatedGroupsQuery,
  useGetMyJoinedGroupsQuery,
  useGetMyGroupsQuery,
  useGetSuggestionGroupsQuery,
  useGetViewByIdGroupQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useCreateGroupMutation,
  useGroupUpdateMutation,
  useGroupLogoUpdateMutation,
  useToggleGroupNotificationMutation,
  useGroupBanUserMutation,
  useGetInviteUsersGroupQuery,
  useGroupInviteUserMutation,
} = groupSlice;
