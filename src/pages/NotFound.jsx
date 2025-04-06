import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../context/userContext";

function NotFound() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Determine where to navigate based on user role
  const getDashboardPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "patient":
        return "/patient";
      case "doctor":
        return "/doctor";
      case "receptionist":
        return "/reception";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Please
            check the URL or navigate back to safety.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
            <Link
              to={getDashboardPath()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 flex items-center justify-center gap-2 shadow-sm font-medium"
            >
              <Home className="h-5 w-5" />
              {user ? "Dashboard" : "Go Home"}
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
