import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { setClasses } from "./classSlice";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const classesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => ({
        url: "/class/getallclasses",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          dispatch(setClasses(res.data));
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: ["AllClasses"],
    }),
    getClassById: builder.query({
      query: (classId) => ({
        url: `/class/${classId}`,
      }),
    }),
    createNewClass: builder.mutation({
      query: (newClassData) => ({
        url: "/class/addnewclass",
        method: "POST",
        body: { ...newClassData },
      }),

      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),
    addStudent: builder.mutation({
      query: (data) => ({
        url: `/class/addstudent`,
        method: "PUT",
        body: data, //upravit formu data
      }),
      invalidatesTags: [{ type: "ClassStudents" }],
    }),

    getClassAsignments: builder.query({
      query: (classId) => ({
        url: `/class/getasignments?classId=${classId}`,
      }),
      providesTags: ["Asignments"],
    }),
    fillClassAttendance: builder.mutation({
      query: (data) => ({
        url: "/class/attendance",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "AllClasses" }],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateNewClassMutation,
  useAddStudentMutation,
  useGetClassByIdQuery,
  useGetClassAsignmentsQuery,
  useFillClassAttendanceMutation,
} = classesApiSlice;

// returns the query result object
export const selectClassesResult =
  classesApiSlice.endpoints.getClasses.select();

// creates memoized selector
const selectClassesData = createSelector(
  selectClassesResult,
  (classesResult) => classesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllClasses,
  selectById: selectClassById,
  // selectIds: selectClassIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectClassesData(state) ?? initialState
);
