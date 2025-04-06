import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Setup axios interceptors for auth and session headers
  const setupAxiosInterceptors = () => {
    // Store references to interceptors for later cleanup
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        const sessionToken = localStorage.getItem("sessionToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (sessionToken) {
          config.headers["x-session-token"] = sessionToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle session expiry responses
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 ||
            (error.response.status === 403 &&
              error.response.data?.message?.includes("session")))
        ) {
          // Force logout
          logoutUser();
          toast.error("Your session has expired. Please login again.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // Return the interceptor IDs for cleanup
    return { requestInterceptor, responseInterceptor };
  };

  // Initialize context and check for existing session
  useEffect(() => {
    // Setup interceptors and store references
    const interceptors = setupAxiosInterceptors();

    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const sessionToken = localStorage.getItem("sessionToken");

      if (token && sessionToken) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/user/me`
          );
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("sessionToken");
          localStorage.removeItem("sessionExpiry");
        }
      }

      setLoading(false);
    };

    initializeAuth();

    // Cleanup function to remove interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(interceptors.requestInterceptor);
      axios.interceptors.response.eject(interceptors.responseInterceptor);
    };
  }, []);

  // Login function
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logoutUser = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");

      if (sessionToken) {
        await axios.post(`${import.meta.env.VITE_URL}/api/user/logout`);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionExpiry");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
