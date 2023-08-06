import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useRefreshMutation } from "../features/auth/authService";
import Spinner from "../components/spinner/Spinner";

const Protected = () => {
  const token = useSelector(selectCurrentToken);

  const [verifyToken, setVerifyToken] = useState(false);

  const effectRan = useRef(false);

  const navigate = useNavigate();

  const [
    refresh,
    {
      isUninitialized: isUninitializedRefresh,
      isLoading: isLoadingRefresh,
      isError: isErrorRefresh,
      isSuccess: isSuccessRefresh,
      // error: refreshError,
    },
  ] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          await refresh();
          setVerifyToken(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token) {
        verifyRefreshToken();
      }
    }
    return () => (effectRan.current = true);
    // eslint-disable-next-line
  }, []);

  let content;

  if (isLoadingRefresh) {
    console.log("loading");
    content = <Spinner />;
  } else if (isErrorRefresh) {
    console.log("error");
    // content = <LoginExpired message={refreshError?.data?.message} />;
    navigate("/login");
  } else if (isSuccessRefresh && verifyToken) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitializedRefresh) {
    console.log("token and uninit");
    content = <Outlet />;
  }

  return content;
};
export default Protected;
