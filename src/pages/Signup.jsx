// src/pages/Login.js
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { Toaster, toast } from "react-hot-toast";
import Logo from "../components/Logo";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "patient",
  });
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { name, email, password, role } = formData;

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/register`,
        { name, email, password, role },
        { withCredentials: true }
      );

      toast.success("user register successfully");
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setFormData({ name: "", email: "", password: "", role: "patient" });
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
              <span className="text-blue-700 font-semibold text-xs sm:text-sm ">
                Create an MediQueue Account
              </span>
            </div>
            <div className="mt-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 text-start font-semibold text-sm">
                    Name
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    className="px-3 py-2 bg-blue-50 focus:ring-1  border border-blue-600/20 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                    onChange={handleInputChange}
                    name="name"
                  />
                </div>
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
                  <span className="text-blue-600 text-start font-semibold text-sm">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-blue-50 focus:ring-1  border border-blue-600/20 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600 text-start font-semibold text-sm">
                    Role
                  </span>
                  <select
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    className="px-3 py-2 bg-blue-50 focus:ring-1  border border-blue-600/20 focus:ring-blue-600 outline-none rounded-md placeholder:text-sm text-blue-600"
                  >
                    <option value="patient" className="text-blue-600">
                      patient
                    </option>
                    <option value="receptionist" className="text-blue-600">
                      receptionist
                    </option>
                    <option value="doctor" className="text-blue-600">
                      doctor
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {!loading ? (
                <button
                  onClick={handleSignup}
                  className="bg-blue-600 py-1 gap-2 rounded-md flex items-center text-white justify-center w-full text-center"
                >
                  <span>
                    <CiMail size={25} color="white" />
                  </span>
                  <span className="text-sm">Register</span>
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
              <Link
                to="/login"
                className="text-blue-700 hover:underline text-[14px] font-[400] cursor-pointer"
              >
                Already have an Account?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Signup;
