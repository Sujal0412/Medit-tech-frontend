import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

function SessionInfo() {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/user/session-status`
        );
        setSessionInfo(response.data.sessionStatus);
      } catch (error) {
        console.error("Failed to fetch session info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();

    // Refresh every minute
    const interval = setInterval(fetchSessionInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !sessionInfo) return null;

  // Calculate session expiry
  const expiryDate = new Date(sessionInfo.sessionExpiresAt);
  const now = new Date();
  const timeLeftMs = expiryDate - now;
  const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="text-xs text-blue-700 flex flex-col items-end">
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        <span>Login: {new Date(sessionInfo.lastLogin).toLocaleString()}</span>
      </div>
      {timeLeftMs > 0 && (
        <div className="mt-1">
          <span>
            Session expires in: {hoursLeft}h {minutesLeft}m
          </span>
        </div>
      )}
    </div>
  );
}

export default SessionInfo;
