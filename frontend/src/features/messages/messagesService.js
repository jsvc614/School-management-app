import { apiSlice } from "../api/apiSlice";

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesWithSpecificUser: builder.query({
      query: (userId) => ({
        url: `/messages/${userId}`,
      }),
      //   providesTags: ["Asignments"],
    }),
    getMessagesForGroup: builder.query({
      query: (groupName) => ({
        url: `messages/group/${groupName}`,
      }),
    }),
    getMessages: builder.query({
      query: () => ({
        url: "/messages",
      }),
      // providesTags: ["Messages"],
    }),
    sendMessageToApi: builder.mutation({
      query: (data) => ({
        url: "/messages/newMessage",
        method: "POST",
        body: data,
      }),
    }),
    userReadMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/read",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMessagesWithSpecificUserQuery,
  useGetMessagesQuery,
  useSendMessageToApiMutation,
  useGetMessagesForGroupQuery,
  useUserReadMessageMutation,
} = messagesApiSlice;
