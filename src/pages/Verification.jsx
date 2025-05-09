import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";
import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/api/user/verify`,
          { token: decodeURIComponent(token) }
        );

        setVerificationState("success");
        setMessage(response.data.message);
        toast.success("Email verified successfully!");

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        setVerificationState("error");
        setMessage(error.response?.data?.message || "Verification failed");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationState("error");
      setMessage("Invalid verification link");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-600/10 to-purple-400/10 blur-3xl"></div>

        <div className="relative max-w-lg mx-auto px-4 sm:px-6">
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
                  Email Verification
                </h2>
              </div>

              <div className="flex flex-col items-center py-4">
                {verificationState === "verifying" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-16 h-16 mb-4 flex justify-center items-center">
                      <Loader className="h-12 w-12 text-blue-400 animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">
                      Verifying your email
                    </h3>
                    <p className="text-gray-400 text-center">
                      Please wait while we confirm your email address...
                    </p>
                  </motion.div>
                )}

                {verificationState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">
                      Email Verified Successfully!
                    </h3>
                    <p className="text-gray-400 text-center mb-6">{message}</p>
                    <p className="text-sm text-gray-500 mb-8">
                      You will be redirected to login in a few seconds...
                    </p>
                    <Link to="/login">
                      <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group">
                        Go to Login
                        <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>
                )}

                {verificationState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-full flex items-center justify-center mb-6">
                      <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">
                      Verification Failed
                    </h3>
                    <p className="text-gray-400 text-center mb-8">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <Link to="/login" className="w-full sm:w-auto">
                        <button className="w-full bg-[#171B24] border border-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-[#1F242E] transition-all duration-300">
                          Back to Login
                        </button>
                      </Link>
                      <Link
                        to="/resend-verification"
                        className="w-full sm:w-auto"
                      >
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group">
                          Resend Verification
                          <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default VerifyEmail;
