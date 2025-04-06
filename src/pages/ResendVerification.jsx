import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CiMail } from "react-icons/ci";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";

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
    <div>
      <div className="h-screen max-sm:p-2 relative bg-gradient-to-br from-blue-100 via-white to-blue-100 flex justify-center items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[410px] z-10 p-4 md:p-6 rounded-md bg-blue-100/50 border border-blue-600/20">
          <div className="flex flex-col justify-center text-center gap-2">
            <div className="flex flex-col gap-1 items-center">
              <Logo
                className="text-2xl sm:text-3xl"
                font="text-xl sm:text-2xl"
              />
              <span className="text-blue-700 font-semibold text-xs sm:text-sm">
                Resend Verification Email
              </span>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 text-start font-semibold text-sm">
                    Email Address
                  </span>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 bg-blue-50 border border-blue-600/20 focus:ring-1 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {!loading ? (
                <button
                  onClick={handleResend}
                  className="bg-blue-600 py-2 gap-2 rounded-md flex items-center text-white justify-center w-full text-center"
                >
                  <span>
                    <CiMail size={25} color="white" />
                  </span>
                  <span className="text-sm">Resend Verification</span>
                </button>
              ) : (
                <button
                  disabled
                  className="bg-blue-600 py-2 gap-2 rounded-md flex items-center text-white justify-center w-full text-center"
                >
                  <div className="w-4 h-4 border-2 border-t-transparent border-white border-solid rounded-full animate-spin" />
                  <span className="text-sm font-[500]">Sending...</span>
                </button>
              )}

              <Link
                to="/login"
                className="text-blue-700 hover:underline text-[14px] font-[400] cursor-pointer"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default ResendVerification;
