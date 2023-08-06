import { apiSlice } from "../api/apiSlice";

export const asignmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query({
      query: (classId) => ({
        url: `/test/getasignments?classId=${classId}`,
      }),
      providesTags: ["Asignments"],
    }),
    addTest: builder.mutation({
      query: (asignmentForm) => ({
        url: `/test/addnewasignment`,
        method: "POST",
        body: asignmentForm,
      }),
    }),
    editTest: builder.mutation({
      query: (data) => ({
        url: "/test/editasignment",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Asignments"],
    }),
    removeTest: builder.mutation({
      query: (id) => ({
        url: "/test/removeasignment",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Asignments"],
    }),
    markAsignment: builder.mutation({
      query: (markData) => ({
        url: "test/markasignment",
        method: "POST",
        body: markData,
      }),
      invalidatesTags: ["Asignments"],
    }),
    getSubmittedAsignmentFiles: builder.query({
      query: (asignmentId) => ({
        url: `/test/submittedfiles/${asignmentId}`,
      }),
      providesTags: ["Asignments"],
    }),
    sendAsignment: builder.mutation({
      query: (data) => ({
        url: `/test/uploadasignment`,
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["Asignments"],
    }),
    getAsignmentResults: builder.query({
      query: (asignemntId) => ({
        url: `/test/asignmentresults?asignmentId=${asignemntId}`,
      }),
    }),
    getSchedule: builder.query({
      query: () => ({
        url: "/user/schedule",
      }),
    }),
  }),
});

export const {
  useGetTestsQuery,
  useMarkAsignmentMutation,
  useGetSubmittedAsignmentFilesQuery,
  useEditTestMutation,
  useSendAsignmentMutation,

  useGetAsignmentResultsQuery,
  useAddTestMutation,
  useGetScheduleQuery,
  useRemoveTestMutation,
} = asignmentApiSlice;
