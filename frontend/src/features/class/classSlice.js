import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classes: [],
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    resetClasses: (state, action) => {
      state.classes = [];
    },
  },
});

export const { setClasses, resetClasses } = classSlice.actions;

export default classSlice.reducer;

export const selectCurrentClasses = (state) => state.class.classes;
