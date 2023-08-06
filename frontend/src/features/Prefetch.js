import { store } from "../app/store";
import { classesApiSlice } from "./class/classService";

import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      classesApiSlice.util.prefetch(
        "getClasses",
        "getNotifications",
        // "getStudentsResults",
        // "getSchedule",
        {
          force: true,
        }
      )
    );
    // store.dispatch(
    //   usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    // );
  }, []);

  return <Outlet />;
};
export default Prefetch;
