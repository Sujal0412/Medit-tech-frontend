import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../context/userContext";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";

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
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-600/10 to-purple-400/10 blur-3xl"></div>

        <div className="relative max-w-lg mx-auto px-4 sm:px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-red-600/10 to-red-400/10 flex items-center justify-center border border-red-500/30">
                <FaExclamationTriangle className="h-16 w-16 text-red-400" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              The page you're looking for doesn't exist or has been moved.
              Please check the URL or navigate back.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-[#171B24] border border-gray-700 rounded-lg hover:bg-[#1F242E] transition-all duration-300 flex items-center justify-center gap-2 text-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>

              <Link
                to={getDashboardPath()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium group"
              >
                {user ? "Dashboard" : "Go Home"}
                <FaArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500/30 to-cyan-400/30 max-w-xs mx-auto">
              <div className="rounded-xl bg-[#0D1117]/70 p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-400">
                  Lost? Don't worry, you can always return to a safe place.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
