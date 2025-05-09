// src/pages/Login.js
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";
import axios from "axios";
import { useUser } from "../context/userContext";
import { motion } from "framer-motion";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  const { loginUser } = useUser();
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Please enter your password");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };
  // In your handleSignin function
  // Update the handleSignin function
  const handleSignin = async () => {
    if (!validateInput()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      // Store both user data and session token
      loginUser(response.data.user);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Store session token and expiry
      if (response.data.sessionToken) {
        localStorage.setItem("sessionToken", response.data.sessionToken);
        localStorage.setItem("sessionExpiry", response.data.expiresAt);
      }

      toast.success("User logged in successfully");
      navigate(
        `/${
          response.data.user.role === "receptionist"
            ? "reception"
            : response.data.user.role
        }`
      );
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || error.message);
      if (error.response?.data?.isVerified === false) {
        setShowVerificationPrompt(true);
      } else {
        setShowVerificationPrompt(false);
      }
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
                  Sign in to your account
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Enter your credentials to access your account
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-300"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#171B24] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      className="text-sm font-medium text-gray-300"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#171B24] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {!loading ? (
                  <button
                    onClick={handleSignin}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group"
                  >
                    Sign in
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
                    Signing in...
                  </button>
                )}
              </div>

              {showVerificationPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-[#1A1E26] border border-yellow-600/20 rounded-lg"
                >
                  <p className="text-yellow-300 text-sm mb-3">
                    Your email address has not been verified yet. Please check
                    your inbox for a verification link or click below to resend.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowVerificationPrompt(false)}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => navigate("/resend-verification")}
                      className="px-3 py-1 text-xs bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded hover:brightness-110 transition-all"
                    >
                      Resend Verification
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Create one now
                  </Link>
                </p>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <p className="text-xs text-center text-gray-500">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Login;
