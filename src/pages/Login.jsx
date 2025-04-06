// src/pages/Login.js
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";
import axios from "axios";
import { useUser } from "../context/userContext";

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
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || error.message);
      setShowVerificationPrompt(!error.response?.data?.isVerified);
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
                font="text-xl sm:text-2xl "
              />
              <span className="text-blue-700 font-semibold text-xs sm:text-sm ">
                Sign in to your MediQueue Account
              </span>
            </div>
            <div className="mt-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 text-start font-semibold text-sm">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-blue-50 border border-blue-600/20 focus:ring-1 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-blue-600 text-start font-semibold text-sm">
                      Password
                    </span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-blue-50 focus:ring-1  border border-blue-600/20 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {!loading ? (
                <button
                  onClick={handleSignin}
                  className="bg-blue-600 py-1 gap-2 rounded-md flex items-center text-white justify-center w-full text-center"
                >
                  <span>
                    <CiMail size={25} color="white" />
                  </span>
                  <span className="text-sm">Login with Mail</span>
                </button>
              ) : (
                <button
                  disabled={!loading}
                  className="bg-blue-600 py-2 gap-2 rounded-md flex items-center text-white justify-center w-full text-center"
                >
                  <div className="w-4 h-4 border-2 border-t-transparent border-white border-solid rounded-full animate-spin" />
                  <span className="text-sm font-[500]">Signing in...</span>
                </button>
              )}

              {showVerificationPrompt && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 mb-2">
                    Your email address has not been verified yet. Please check
                    your inbox for a verification link or click below to resend.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowVerificationPrompt(false)}
                      className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => navigate("/resend-verification")}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-600"
                    >
                      Resend Verification
                    </button>
                  </div>
                </div>
              )}

              <Link
                to="/signup"
                className="text-blue-700 hover:underline text-[14px] font-[400] cursor-pointer"
              >
                Don't have an Account?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
