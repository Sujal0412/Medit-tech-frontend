import React from "react";
import { useUser } from "../context/userContext";
import { Navigate } from "react-router-dom";

function Protect({ children }) {
  const { user } = useUser(); 

  return user ? children : <Navigate to="/login" />;
}

export default Protect;
