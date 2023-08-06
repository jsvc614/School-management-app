import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  let content;
  if (user) {
    content =
      user?.role === allowedRoles ? (
        <Outlet />
      ) : (
        <Navigate to="/dashboard" state={{ from: location }} replace />
      );
  }
  return content;
};
export default RequireAuth;
