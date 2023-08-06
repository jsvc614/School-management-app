import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setUser } from "../auth/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://192.168.0.103:5000",
  // baseUrl: "http://10.0.2.2:5000",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://schoolapp-api.onrender.com"
      : "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 && args.url !== "/auth/refresh") {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          "/auth/refresh",
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          api.dispatch(setUser({ ...refreshResult.data }));
          result = await baseQuery(args, api, extraOptions);
        } else {
          if (refreshResult?.error?.status === 401) {
            refreshResult.error.data.message = "Your login has expired.";
          }
          api.dispatch(logOut());
          return refreshResult;
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Chat",
    "Class",
    "Asignments",
    "Messages",
    "ClassStudents",
    "Notifications",
    "UserProfile",
    "AllClasses",
  ],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true, //fix autorefetch student search
  endpoints: (builder) => ({}),
});
