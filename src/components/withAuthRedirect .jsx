import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const WithAuthRedirect = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    useEffect(() => {
      const currentPath = location.pathname;

      if (!user) {
        // If not authenticated and not already on the login page, redirect to login
        if (currentPath !== "/login") {
          navigate("/login", { replace: true });
        }
      } else {
        console.log(currentPath.startsWith("/patient"));
        // Logic for redirection based on role and current route
        if (user.role === "patient" && !currentPath.startsWith("/patient")) {
          navigate("/patient", { replace: true });
        } else if (
          user.role === "doctor" &&
          !currentPath.startsWith("/doctor")
        ) {
          navigate("/doctor", { replace: true });
        } else if (
          user.role === "receptionist" &&
          !currentPath.startsWith("/reception")
        ) {
          navigate("/reception", { replace: true });
        }
      }
    }, [user, navigate, location]);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuthRedirect;
