import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";

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
                Email Verification
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {verificationState === "verifying" && (
                <div className="flex flex-col items-center py-8">
                  <div className="w-12 h-12 border-4 border-t-transparent border-blue-600 border-solid rounded-full animate-spin mb-4" />
                  <p className="text-blue-600 text-lg">
                    Verifying your email address...
                  </p>
                </div>
              )}

              {verificationState === "success" && (
                <div className="flex flex-col items-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-blue-800 text-xl font-semibold mb-2">
                    Email Verified!
                  </p>
                  <p className="text-blue-600 text-center mb-4">{message}</p>
                  <p className="text-sm text-blue-500 mb-6">
                    You will be redirected to login in a few seconds...
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 py-2 px-6 gap-2 rounded-md text-white w-full max-w-[200px] hover:bg-blue-700"
                  >
                    Go to Login
                  </button>
                </div>
              )}

              {verificationState === "error" && (
                <div className="flex flex-col items-center py-6">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-blue-800 text-xl font-semibold mb-2">
                    Verification Failed
                  </p>
                  <p className="text-blue-600 text-center mb-6">{message}</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[300px]">
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-gray-200 py-2 px-4 rounded-md text-blue-800 hover:bg-gray-300 flex-1"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => navigate("/resend-verification")}
                      className="bg-blue-600 py-2 px-4 rounded-md text-white hover:bg-blue-700 flex-1"
                    >
                      Resend Verification
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default VerifyEmail;
