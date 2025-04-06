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
} from "lucide-react";
import axios from "axios";
import Logo from "../components/Logo";
import WithAuthRedirect from "../components/withAuthRedirect ";
import { useUser } from "../context/userContext";
import SessionInfo from "../pages/SessionInfo";
import SessionExpiryMonitor from "../pages/SessionExpiryMonitor";

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
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
              : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
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

// Sidebar Component
function Sidebar({ navItems, sidebarOpen, toggleSidebar, isMobile }) {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  // Update the handlelogout function
  const handlelogout = async () => {
    try {
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

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 shadow-sm transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-16"}
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 py-4 border-b border-gray-200">
        {sidebarOpen && (
          <Logo className="text-2xl sm:text-3xl" font="text-xl sm:text-2xl" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 cursor-pointer hover:bg-gray-100"
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
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <ul onClick={handlelogout} className="space-y-2">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Log Out"
              collapsed={!sidebarOpen}
            />
          </ul>
        </div>
      </nav>
    </div>
  );
}

// Stats Card Component

// Dashboard Component
function Dashboard({ navItems }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDemoContent, setShowDemoContent] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-16"
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {/* Sidebar Toggle (Mobile) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-blue-600 md:hidden focus:outline-none"
              >
                <Menu size={20} />
              </button>

              <div className="sm:hidden">
                <Logo className="text-2xl" font="text-xl" />
              </div>

              {/* Search Bar */}
              <div className="relative max-sm:hidden w-auto">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="pl-10 px-4 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none rounded-lg placeholder:text-sm text-gray-700 w-full sm:w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Patient ID Badge for desktop */}
              {user?.role === "patient" && patientId && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <IdCard size={16} className="text-blue-600 mr-1.5" />
                  <span className="text-xs font-medium text-blue-800">
                    ID: {patientId}
                  </span>
                </div>
              )}

              <div className="hidden md:block">
                <p className="text-sm text-gray-600">
                  Hello,{" "}
                  <span className="font-medium text-gray-900 truncate w-2">
                    {user.name.split(" ")[0]}
                  </span>
                </p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                  {user.name.split(" ")[0][0].toUpperCase()}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 ">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                    {/* Show patient ID in tooltip */}
                    {user?.role === "patient" && patientId && (
                      <div className="flex items-center mt-2 bg-blue-50 px-2 py-1 rounded">
                        <IdCard size={14} className="text-blue-600 mr-1" />
                        <span className="text-xs font-medium text-blue-700">
                          ID: {patientId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Patient ID Badge */}
          {user?.role === "patient" && patientId && (
            <div className="md:hidden flex items-center justify-center pb-2 px-4">
              <div className="flex items-center w-full px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                <IdCard size={16} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Patient ID: {patientId}
                </span>
              </div>
            </div>
          )}
        </header>

        <main className="md:p-6 p-2">
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
