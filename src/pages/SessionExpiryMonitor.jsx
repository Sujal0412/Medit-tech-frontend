import { useEffect } from "react";
import { useUser } from "../context/userContext";
import { toast } from "react-hot-toast";

function SessionExpiryMonitor() {
  const { logoutUser } = useUser();

  useEffect(() => {
    // Check session validity every minute
    const interval = setInterval(() => {
      const expiryTimeStr = localStorage.getItem("sessionExpiry");

      if (expiryTimeStr) {
        const expiryDate = new Date(expiryTimeStr);
        const now = new Date();

        // If less than 5 minutes remaining, show warning
        const fiveMinutes = 5 * 60 * 1000;
        if (expiryDate - now < fiveMinutes && expiryDate > now) {
          toast.error("Your session will expire in less than 5 minutes.");
        }

        // If expired, force logout
        if (expiryDate <= now) {
          logoutUser();
          toast.error("Your session has expired. Please login again.");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [logoutUser]);

  return null; // This is a non-visual component
}

export default SessionExpiryMonitor;
