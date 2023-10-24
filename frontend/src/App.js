import { Route, Routes } from "react-router-dom";
import Protected from "./utils/Protected";
import NotFound from "./components/notFound/NotFound";
import RequireAuth from "./utils/RequireRole";
import { ROLES } from "./config/roles";
import io from "socket.io-client";
import { Suspense, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./features/auth/authSlice";
import { SocketContext } from "./context/socket";
import DashLayout from "./layout/DashLayout";
import Layout from "./layout/Layout";

function App() {
  const [socket, setSocket] = useState(null);

  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      setSocket(
        io(
          process.env.NODE_ENV === "production"
            ? "https://school-management-app-u8st.vercel.app"
            : "http://localhost:8900"
        )
      );
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket?.emit("new-user-add", user?.id);
    }
  }, [socket, user]);

  const Dashboard = lazy(() => import("./pages/Dashboard"));
  const Login = lazy(() => import("./pages/Login/Login"));
  const UserProfile = lazy(() => import("./pages/user/UserProfile"));
  const Classes = lazy(() => import("./pages/Classes/Classes"));
  const ClassInfo = lazy(() => import("./pages/Classes/ClassInfo"));
  const AsignmentList = lazy(() =>
    import("./pages/Classes/asignments/AsignmentList")
  );
  const NewClass = lazy(() => import("./pages/Classes/NewClass"));
  const AsignmentSubmittedFiles = lazy(() =>
    import("./pages/Classes/asignments/AsignmentSubmittedFiles")
  );
  const ClassAttendance = lazy(() =>
    import("./pages/Classes/attendance/ClassAttendance")
  );
  const StudentAttendance = lazy(() =>
    import("./components/dasboard/StudentAttendance")
  );
  const StudentGrades = lazy(() =>
    import("./components/dasboard/StudentGrades")
  );
  const AsignmentResults = lazy(() =>
    import("./pages/Classes/asignments/AsignmentResults")
  );
  const MessagesList = lazy(() => import("./pages/Messages/MessagesList"));
  const Schedule = lazy(() => import("./pages/Schedule/Schedule"));

  return (
    <SocketContext.Provider value={socket}>
      <Suspense>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}

          <Route path="/" element={<Login />} />
          <Route element={<Protected />}>
            <Route path="/" element={<DashLayout />}>
              <Route
                path="/dashboard"
                element={
                  <Suspense>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="profile/:email"
                element={
                  <Suspense>
                    <UserProfile />
                  </Suspense>
                }
              />
              <Route path="classes">
                <Route
                  index
                  element={
                    <Suspense>
                      <Classes />
                    </Suspense>
                  }
                />
                <Route
                  path=":classId"
                  element={
                    <Suspense>
                      <ClassInfo />
                    </Suspense>
                  }
                />
                <Route
                  path=":classId/asignments"
                  element={
                    <Suspense>
                      <AsignmentList />
                    </Suspense>
                  }
                />
                <Route element={<RequireAuth allowedRoles={ROLES.Teacher} />}>
                  <Route
                    path="new"
                    element={
                      <Suspense>
                        <NewClass />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":classId/asignments/:asignmentId/submitted"
                    element={
                      <Suspense>
                        <AsignmentSubmittedFiles />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":classId/attendance"
                    element={
                      <Suspense>
                        <ClassAttendance />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={ROLES.Student} />}>
                <Route
                  path="grades"
                  element={
                    <Suspense>
                      <StudentGrades />
                    </Suspense>
                  }
                />
                <Route
                  path="attendance"
                  element={
                    <Suspense>
                      <StudentAttendance />
                    </Suspense>
                  }
                />
                <Route
                  path="asignments/:asignmentId/results"
                  element={
                    <Suspense>
                      <AsignmentResults />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="messages"
                element={
                  <Suspense>
                    <MessagesList socket={socket} />
                  </Suspense>
                }
              />
              <Route
                path="schedule"
                element={
                  <Suspense>
                    <Schedule />
                  </Suspense>
                }
              />
              <Route element={<RequireAuth allowedRoles={ROLES.Admin} />}>
                <Route path="addteacher" element={<p>addteacher</p>} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
          {/* </Route> */}
        </Routes>
      </Suspense>
    </SocketContext.Provider>
  );
}

export default App;
