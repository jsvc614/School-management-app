import { apiSlice } from "../api/apiSlice";

export const classesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => ({
        url: "/user/students",
      }),
    }),
    getTeachers: builder.query({
      query: () => ({
        url: "/user/teachers",
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/user/users",
      }),
    }),
    searchStudents: builder.mutation({
      query: (name) => ({
        url: `/user/searchstudent/${name}`,
      }),
    }),
    getUser: builder.mutation({
      query: (name) => ({
        url: `/user?searchvalue=${name}`,
      }),
    }),
    getStudentsByClass: builder.query({
      query: (classId) => ({
        url: `/class/getstudents?classId=${classId}`,
      }),
      providesTags: ["ClassStudents"],
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: "/user/editprofile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    getStudentProfile: builder.query({
      query: (email) => ({
        url: `/user/profile/${email}`,
      }),
      providesTags: ["UserProfile"],
    }),
    getStudentsResults: builder.query({
      query: () => ({
        url: `/user/getStudentsResults`,
      }),
    }),
    getStudentGrades: builder.query({
      query: () => ({
        url: "/user/getStudentGrades",
      }),
    }),
    getStudentAttendance: builder.query({
      query: () => ({
        url: "/user/getStudentAttendance",
      }),
    }),
    contactUs: builder.mutation({
      query: (body) => ({
        url: "/user/contactus",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useSearchStudentsMutation,
  useGetStudentsByClassQuery,
  useGetStudentsQuery,
  useGetTeachersQuery,
  useGetUsersQuery,
  useGetUserMutation,
  useEditProfileMutation,
  useGetStudentProfileQuery,
  useGetStudentsResultsQuery,
  useGetStudentAttendanceQuery,
  useGetStudentGradesQuery,
  useContactUsMutation,
} = classesApiSlice;
