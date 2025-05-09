import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronRight,
  Calendar,
  Activity,
  Clock,
  Clipboard,
  ChevronLeft,
  PanelsTopLeft,
  UserPen,
  LogOut,
  IdCard,
  X,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import Logo from "../components/Logo";
import WithAuthRedirect from "../components/withAuthRedirect ";
import { useUser } from "../context/userContext";
import SessionInfo from "../pages/SessionInfo";
import SessionExpiryMonitor from "../pages/SessionExpiryMonitor";
import { motion } from "framer-motion";

// SidebarItem Component
function SidebarItem({ icon, text, to, collapsed }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <NavLink
        to={to}
        className={`flex items-center p-3 rounded-lg transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-md"
              : "hover:bg-[#171B24] text-gray-400 hover:text-blue-400"
          }
          ${collapsed ? "justify-center" : "justify-start"}
        `}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {!collapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
        {isActive && !collapsed && (
          <ChevronRight size={16} className="ml-auto text-white" />
        )}
      </NavLink>
    </li>
  );
}

// Dashboard Component
function Dashboard({ navItems }) {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Handle logout function
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const token = localStorage.getItem("token");
      const sessionToken = localStorage.getItem("sessionToken");

      if (token && sessionToken) {
        // Call the logout API with proper headers
        await axios.post(
          `${import.meta.env.VITE_URL}/api/user/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-session-token": sessionToken,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and context state
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionExpiry");
      logoutUser();
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchPatientId = async () => {
      if (user?.role === "patient") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/patient/get-profile`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );

          if (response.data) {
            setPatientId(response.data.patient.patientIdentifier);
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user?.role === "patient") {
      fetchPatientId();
    }
  }, [user]);
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#0A0C10]">
      {/* Sidebar */}
      <motion.div
        initial={{ x: isMobile ? -280 : 0 }}
        animate={{
          x: isMobile && !sidebarOpen ? -280 : 0,
          width: sidebarOpen ? 280 : 72,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-30 bg-[#0D1117] border-r border-gray-800 shadow-md`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 py-4.5 border-b border-gray-800">
          {sidebarOpen && <Logo className="text-2xl" font="text-lg" />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-md text-gray-400 cursor-pointer hover:bg-[#171B24] hover:text-blue-400 transition-colors`}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-70px)]">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                to={item.to}
                collapsed={!sidebarOpen}
              />
            ))}
          </ul>

          {/* Bottom Navigation Section */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800 bg-[#0D1117]">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200
                    hover:bg-[#171B24] text-gray-400 hover:text-red-400 w-full
                    ${!sidebarOpen ? "justify-center" : "justify-start"}
                    ${loggingOut ? "cursor-not-allowed opacity-70" : ""}
                  `}
                >
                  {loggingOut ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogOut size={20} />
                  )}
                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {loggingOut ? "Signing out..." : "Log Out"}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          sidebarOpen && !isMobile ? "md:ml-[280px]" : "md:ml-[72px]"
        }`}
      >
        {/* Header */}
        <header className="bg-[#0D1117] border-b border-gray-800 sticky top-0 z-20 backdrop-blur-lg bg-opacity-80">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {/* Sidebar Toggle (Mobile) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-blue-400 md:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md shadow-blue-500/20">
                <Logo className="text-3xl" font="text-xl" />
              </div>

              {/* Search Bar */}
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-400 hover:text-blue-400 p-2 rounded-full hover:bg-[#171B24] transition-colors"
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="relative flex-grow">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="pl-10 pr-10 py-2 w-full bg-[#171B24] border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Patient ID Badge for desktop */}
              {user?.role === "patient" && patientId && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-blue-900/30 rounded-full border border-blue-800/30">
                  <IdCard size={16} className="text-blue-400 mr-1.5" />
                  <span className="text-xs font-medium text-blue-300">
                    ID: {patientId}
                  </span>
                </div>
              )}

              <div className="hidden md:block">
                <p className="text-sm text-gray-400">
                  Hello,{" "}
                  <span className="font-medium text-gray-200">
                    {user.name.split(" ")[0]}
                  </span>
                </p>
              </div>

              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium shadow-md shadow-blue-500/20">
                  {user.name.split(" ")[0][0].toUpperCase()}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute right-0 mt-2 w-48 bg-[#0D1117] rounded-lg shadow-lg border border-gray-800 py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-200">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user.role}
                    </p>
                    {/* Show patient ID in tooltip */}
                    {user?.role === "patient" && patientId && (
                      <div className="flex items-center mt-2 bg-blue-900/30 px-2 py-1 rounded">
                        <IdCard size={14} className="text-blue-400 mr-1" />
                        <span className="text-xs font-medium text-blue-300">
                          ID: {patientId}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-[#171B24] text-gray-400 hover:text-red-400 text-sm"
                    >
                      {loggingOut ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Signing out...
                        </>
                      ) : (
                        <>
                          <LogOut size={14} className="mr-2" />
                          Log Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Patient ID Badge */}
          {user?.role === "patient" && patientId && (
            <div className="md:hidden flex items-center justify-center pb-2 px-4">
              <div className="flex items-center w-full px-3 py-2 bg-blue-900/30 rounded-lg border border-blue-800/30">
                <IdCard size={16} className="text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">
                  Patient ID: {patientId}
                </span>
              </div>
            </div>
          )}
        </header>

        <main className="md:p-6 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Role-based Dashboards
function AppDashboard() {
  const doctorNavItems = [
    { icon: <Home size={20} />, text: "Dashboard", to: "/doctor" },
    {
      icon: <Calendar size={20} />,
      text: "Appointments",
      to: "/doctor/appointments",
    },
    // { icon: <Users size={20} />, text: "Patients", to: "/doctor/patients" },

    // { icon: <Clock size={20} />, text: "Wait Times", to: "/doctor/wait-times" },
    // { icon: <Clipboard size={20} />, text: "Records", to: "/doctor/records" },
    // { icon: <FileText size={20} />, text: "Reports", to: "/doctor/reports" },
    { icon: <UserPen size={20} />, text: "Profile", to: "/doctor/profile" },
  ];

  return <Dashboard navItems={doctorNavItems} />;
}

function ReceptionDashboard() {
  const receptionNavItems = [
    { icon: <Home size={20} />, text: "Dashboard", to: "/reception" },
    {
      icon: <Users size={20} />,
      text: "Register Patient",
      to: "/reception/add-patient",
    },
    {
      icon: <Calendar size={20} />,
      text: "Book Appointment",
      to: "/reception/book-appoinment",
    },
    {
      icon: <Clipboard size={20} />,
      text: "Check Beds",
      to: "/reception/check-bed",
    },
    {
      icon: <Clock size={20} />,
      text: "Manage Queue",
      to: "/reception/manage-queue",
    },
  ];

  return <Dashboard navItems={receptionNavItems} />;
}

function PatientDashboard() {
  const patientNavItems = [
    // { icon: <Home size={20} />, text: "Dashboard", to: "/patient" },
    {
      icon: <FileText size={20} />,
      text: "Medical History",
      to: "/patient",
    },
    {
      icon: <Calendar size={20} />,
      text: "Book Appointment",
      to: "/patient/book-appointment",
    },

    {
      icon: <Clock size={20} />,
      text: "Queue Status",
      to: "/patient/queue-status",
    },

    { icon: <UserPen size={20} />, text: "Profile", to: "/patient/profile" },
  ];

  return <Dashboard navItems={patientNavItems} />;
}

const AppDashboardWithAuth = WithAuthRedirect(AppDashboard);
const ReceptionDashboardWithAuth = WithAuthRedirect(ReceptionDashboard);
const PatientDashboardWithAuth = WithAuthRedirect(PatientDashboard);

export {
  AppDashboardWithAuth,
  ReceptionDashboardWithAuth,
  PatientDashboardWithAuth,
};
