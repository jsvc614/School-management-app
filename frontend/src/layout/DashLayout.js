import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetClassesQuery } from "../features/class/classService";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallBack";
import ErrorModal from "../components/pop/ErrorModal";
import LoadingSpinner from "../components/spinner/Spinner";

const DashLayout = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [effectRan, setEffectRan] = useState(false);

  const navigate = useNavigate();

  const { isError, isLoading, isSuccess } = useGetClassesQuery(undefined, {
    // pollingInterval: 10000,
  });

  useEffect(() => {
    if (isSuccess) {
      setEffectRan(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  let content = <Outlet />;

  if (isLoading && !effectRan) {
    content = <LoadingSpinner />;
  }

  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => navigate("/")}
      >
        <Navigation />
        <div className="dash-container">
          {content}
          {showErrorModal && (
            <ErrorModal
              show={showErrorModal}
              close={() => setShowErrorModal(false)}
              message={"Problem with getting initial classes data"}
            />
          )}
        </div>
      </ErrorBoundary>
    </>
  );
};

export default DashLayout;
