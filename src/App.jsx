import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MediQueueLanding from "./pages/MediQueueLanding";
import AboutUs from "./pages/AboutUs";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/patient/Dashboard";
import Protect from "./components/Protect";
import { useUser } from "./context/userContext";
import axios from "axios";
import AddPatient from "./pages/receptionist/AddPatient";

import {
  AppDashboardWithAuth,
  PatientDashboardWithAuth,
  ReceptionDashboardWithAuth,
} from "./layouts/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import Profile from "./pages/patient/Profile";
import DProfile from "./pages/doctor/Profile";
import QueueStatus from "./pages/patient/QueueStatus";
import MedicalHistory from "./pages/patient/MedicalHistory";
import QueuePage from "./pages/patient/QueuePage";
import DAppoinmnent from "./pages/doctor/Appoinment";
import DDashboard from "./pages/doctor/Dashboard";
import RDashboard from "./pages/receptionist/Dashboard";
import CheckBed from "./pages/receptionist/CheckBed";
import QueueManage from "./pages/receptionist/QueueManage";
import RQueuePage from "./pages/receptionist/QueuePage";
import RBook from "./pages/receptionist/BookAppoinment";
import NotFound from "./pages/NotFound";
import ResendVerification from "./pages/ResendVerification";
import VerifyEmail from "./pages/Verification";
const App = () => {
  const { loginUser, logoutUser } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        loginUser(response.data.user);
      } catch (error) {
        setLoading(false);

        if (error.response?.status === 403) {
          logoutUser();
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C10]">
        <div className="relative">
          {/* Outer spinning circle */}
          <div className="w-20 h-20 border-4 border-blue-900/40 border-t-blue-500 rounded-full animate-spin"></div>

          {/* Inner pulsing glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse opacity-70"></div>

          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20M4 12H20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="mt-6 text-blue-400 font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8">
          Loading...
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1E26",
            color: "#fff",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#1A1E26",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#1A1E26",
            },
          },
        }}
      />
      <div className="">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <MediQueueLanding />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <AboutUs />
              </>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          <Route
            path="/contact"
            element={
              <>
                <Header />
                <Contact />
              </>
            }
          />
          <Route
            path="/patient"
            element={
              <Protect>
                <PatientDashboardWithAuth />
              </Protect>
            }
          >
            {/* <Route index element={<Dashboard />} /> */}
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="profile" element={<Profile />} />
            <Route path="queue-status" element={<QueueStatus />} />
            <Route path="queue-status/:id" element={<QueuePage />} />
            <Route index element={<MedicalHistory />} />
          </Route>
          <Route
            path="/doctor"
            element={
              <Protect>
                <AppDashboardWithAuth />
              </Protect>
            }
          >
            <Route index element={<DDashboard />} />
            <Route path="profile" element={<DProfile />} />
            <Route path="appointments" element={<DAppoinmnent />} />
          </Route>
          <Route
            path="/reception"
            element={
              <Protect>
                <ReceptionDashboardWithAuth />
              </Protect>
            }
          >
            <Route index element={<RDashboard />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="check-bed" element={<CheckBed />} />
            <Route path="manage-queue" element={<QueueManage />} />
            <Route path="queue/:queueId" element={<RQueuePage />} />
            <Route path="book-appoinment" element={<RBook />} />

            {/* Uncomment and update the settings route if needed */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
