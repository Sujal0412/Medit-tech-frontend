import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Users,
  Calendar,
  UserPlus,
  Search,
  Clock,
  CheckCircle,
  RefreshCw,
  User,
  Bed,
  UserCog,
  Building,
  ChevronRight,
  Activity,
  CalendarPlus,
  X,
  Eye,
  PenLine,
  AlertCircle,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayPatients: 0,
    availableBeds: 0,
    queueLength: 0,
    availableDoctors: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else if (!refreshing) setLoading(true);

      const [statsRes, patientsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL}/api/bed/receptionist/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(
          `${import.meta.env.VITE_URL}/api/bed/receptionist/recent-patients`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (patientsRes.data.success) {
        setRecentPatients(patientsRes.data.patients);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchDashboardData(true);
  };

  // Handle patient search
  const handleSearch = async () => {
    if (searchTerm.length < 2) {
      toast.error("Please enter at least 2 characters to search");
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/patient/search/query`,
        {
          params: { query: searchTerm, includeAppointments: true },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setSearchResults(response.data.patients);
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Failed to search for patients");
    } finally {
      setIsSearching(false);
    }
  };

  // Navigation functions
  const goToNewPatient = () => navigate("/reception/add-patient");
  const goToAssignBed = () => navigate("/reception/check-bed");
  const goToNewAppointment = () => navigate("/reception/book-appoinment");
  const goToAllPatients = () => navigate("/reception/patients");
  const goToQueueManagement = () => navigate("/reception/queue");
  const handleViewPatient = (patientId) =>
    navigate(`/reception/patient/${patientId}`);
  const handleUpdatePatient = (patientId) =>
    navigate(`/reception/update-patient/${patientId}`);
  const handleBookAppointment = (patientId) =>
    navigate(`/reception/book-appointment?patientId=${patientId}`);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between relative">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Reception Dashboard
              </h1>
              <p className="text-gray-400">
                Manage patients, appointments, and hospital resources
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className={`p-2 rounded-full transition-colors ${
                  refreshing
                    ? "bg-blue-600/20 text-blue-400 animate-spin"
                    : "bg-[#171B24] text-gray-400 hover:bg-[#1F242E] hover:text-blue-400"
                }`}
                aria-label="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <Link
                to="/reception/manage-queue"
                className="bg-[#171B24] border border-gray-800 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-300 hover:bg-[#1F242E] transition-colors"
              >
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                Queue Management
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNewPatient}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <UserPlus className="h-5 w-5" />
                Add Patient
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={fadeIn}>
            <StatCard
              title="Today's Patients"
              value={stats.todayPatients}
              icon={<Calendar className="text-blue-400" />}
              color="bg-blue-900/20"
              borderColor="border-blue-800/30"
              iconBg="bg-blue-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Available Beds"
              value={stats.availableBeds}
              icon={<Bed className="text-green-400" />}
              color="bg-green-900/20"
              borderColor="border-green-800/30"
              iconBg="bg-green-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Queue Length"
              value={stats.queueLength}
              icon={<Users className="text-yellow-400" />}
              color="bg-yellow-900/20"
              borderColor="border-yellow-800/30"
              iconBg="bg-yellow-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Doctors Available"
              value={stats.availableDoctors}
              icon={<UserCog className="text-purple-400" />}
              color="bg-purple-900/20"
              borderColor="border-purple-800/30"
              iconBg="bg-purple-900/30"
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 mb-6"
        >
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-400" />
              Quick Actions
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              icon={<UserPlus className="h-6 w-6 text-blue-400 mb-2" />}
              title="Add New Patient"
              description="Register a new patient to the system"
              onClick={goToNewPatient}
              color="from-blue-900/20 via-blue-900/10 to-transparent"
              borderColor="border-blue-800/30"
              hoverColor="hover:bg-blue-900/30"
            />
            <ActionCard
              icon={<Building className="h-6 w-6 text-green-400 mb-2" />}
              title="Manage Beds"
              description="Assign or release patient beds"
              onClick={goToAssignBed}
              color="from-green-900/20 via-green-900/10 to-transparent"
              borderColor="border-green-800/30"
              hoverColor="hover:bg-green-900/30"
            />
            <ActionCard
              icon={<CalendarPlus className="h-6 w-6 text-purple-400 mb-2" />}
              title="New Appointment"
              description="Schedule patient appointments"
              onClick={goToNewAppointment}
              color="from-purple-900/20 via-purple-900/10 to-transparent"
              borderColor="border-purple-800/30"
              hoverColor="hover:bg-purple-900/30"
            />
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800"
        >
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-400" />
              Recent Patients
            </h3>
          </div>

          <div className="overflow-x-auto">
            {recentPatients.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-[#0A0C10]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0D1117] divide-y divide-gray-800">
                  {recentPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-[#171B24] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {patient.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={patient.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-[#0D1117]">
                <Calendar className="h-12 w-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-medium text-gray-200 mb-1">
                  No Recent Patients
                </h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  There are no recent patient visits to display
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNewPatient}
                  className="px-4 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 flex items-center text-sm font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Patient
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "waiting":
      case "scheduled":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/30";
      case "in-progress":
        return "bg-blue-900/30 text-blue-300 border border-blue-800/30";
      case "completed":
        return "bg-green-900/30 text-green-300 border border-green-800/30";
      default:
        return "bg-gray-800 text-gray-300 border border-gray-700";
    }
  };

  let icon;
  switch (status) {
    case "waiting":
    case "scheduled":
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      break;
    case "in-progress":
      icon = <Activity className="h-3.5 w-3.5 mr-1" />;
      break;
    case "completed":
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    default:
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />;
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-full flex items-center w-fit ${getStatusStyle(
        status
      )} text-xs font-medium`}
    >
      {icon}
      {status === "waiting"
        ? "Waiting"
        : status === "in-progress"
        ? "In Progress"
        : status}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between transition-all duration-300 hover:shadow-glow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <p className="text-lg font-semibold text-gray-100">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
  </div>
);

// Action Card Component
const ActionCard = ({
  icon,
  title,
  description,
  onClick,
  color,
  borderColor,
  hoverColor,
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-5 rounded-lg border ${borderColor} bg-gradient-to-br ${color} ${hoverColor} transition-all flex flex-col items-center text-center`}
  >
    {icon}
    <h4 className="font-medium text-gray-200 mb-1">{title}</h4>
    <p className="text-xs text-gray-400">{description}</p>
  </motion.button>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-900/40 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse opacity-70"></div>
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
    <div className="mt-6 text-blue-400 font-medium">Loading dashboard...</div>
  </div>
);

export default Dashboard;
