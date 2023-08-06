import { apiSlice } from "../api/apiSlice";

const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notifications",
      }),
      providesTags: ["Notifications"],
    }),
    newNotification: builder.mutation({
      query: (data) => ({
        url: "/notifications/new",
        method: "POST",
        body: data,
      }),
    }),
    userReadNotification: builder.mutation({
      query: (notificationId) => ({
        url: "/notifications/read",
        method: "PUT",
        body: { notificationId },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useNewNotificationMutation,
  useUserReadNotificationMutation,
} = notificationsApiSlice;
