import { use } from "react";
import baseApiSlice from "../baseApi";

const notificationSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: `/notifications`,
        method: "GET",
      }),
      providesTags: ['Notifications'], 
    }),
    getNotificationCount: builder.query({
      query: () => ({
        url: `/notifications/unread-count`,
        method: "GET",
      }),
      providesTags: ['Notifications'],
    }),
    updateNotificationReadStatus: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-as-read`,
        method: "POST",
      }),
      invalidatesTags: ['Notifications'],
    }),
    clearNotifications: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useGetNotificationCountQuery, 
  useUpdateNotificationReadStatusMutation ,
  useClearNotificationsMutation
} = notificationSlice;