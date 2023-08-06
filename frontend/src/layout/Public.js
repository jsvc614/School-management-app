import React from "react";
import { useNavigate } from "react-router-dom";

const Public = () => {
  const navigate = useNavigate();
  console.log("public");
  return (
    <div>
      <button onClick={() => navigate("/login")}>login</button>
    </div>
  );
};

export default Public;
