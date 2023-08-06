import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
    },
    logOut: (state, action) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, logOut, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
// export const selectAuthState = (state) => state.auth;
