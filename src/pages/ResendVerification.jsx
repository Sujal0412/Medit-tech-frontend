import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight, FaEnvelope } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";
import { motion } from "framer-motion";

function ResendVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email && !sessionStorage.getItem("pendingUserId")) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // If we have a pending userId from a login attempt, use that
      const pendingUserId = sessionStorage.getItem("pendingUserId");

      const requestData = pendingUserId ? { userId: pendingUserId } : { email };

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/send`,
        requestData
      );

      // Clear the stored userId
      sessionStorage.removeItem("pendingUserId");

      toast.success("Verification email sent successfully!");
      navigate("/login", {
        state: {
          message: "Verification email sent. Please check your inbox.",
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Hero Section with Form */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-600/10 to-purple-400/10 blur-3xl"></div>

        <div className="relative max-w-lg mx-auto px-4 sm:px-6">
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500 to-cyan-400"
          >
            <div className="rounded-xl bg-[#0D1117] p-6 md:p-8 backdrop-blur-3xl">
              <div className="flex flex-col items-center justify-center mb-6">
                <Logo
                  className="text-2xl sm:text-3xl"
                  font="text-xl sm:text-2xl"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-100">
                  Resend Verification Email
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Enter your email to receive a new verification link
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-300"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#171B24] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {!loading ? (
                  <button
                    onClick={handleResend}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group"
                  >
                    Resend Verification
                    <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-blue-600/70 to-blue-500/70 text-white/70 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </button>
                )}
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Remember your account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Back to login
                  </Link>
                </p>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <p className="text-xs text-center text-gray-500">
                  If you're still having trouble, please contact our support
                  team for assistance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ResendVerification;
