import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  FileText,
  Timer,
  ChevronDown,
  Mail,
  Phone,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function QueueStatus() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'upcoming'
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  useEffect(() => {
    fetchAppointments();
    // Set up auto-refresh every minute for queue updates
    const interval = setInterval(() => fetchAppointments(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/appointment/get-all-appoinement-patient`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointments(response.data.appointments);
      setError(null);
    } catch (error) {
      setError("Failed to load appointments. Please try again.");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchAppointments(true);
  };

  const handleViewQueue = (appointmentId) => {
    navigate(`/patient/queue-status/${appointmentId}`);
  };

  const handleExpandAppointment = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  // Filter appointments based on selected filter and search query
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter by date
    let dateMatch = true;
    switch (filter) {
      case "today":
        dateMatch = aptDate.toDateString() === today.toDateString();
        break;
      case "upcoming":
        dateMatch = aptDate >= today;
        break;
      default:
        dateMatch = true;
    }

    // Filter by search query
    const searchMatch = searchQuery
      ? apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return dateMatch && searchMatch;
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchAppointments} />;

  // Calculate queue stats
  const queueStats = {
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return isToday(aptDate);
    }).length,
    waitingAppointments: appointments.filter(
      (apt) => apt.status === "scheduled"
    ).length,
    inProgressAppointments: appointments.filter(
      (apt) => apt.status === "in-progress"
    ).length,
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Queue Status</h1>
            <p className="text-gray-400">
              Monitor your appointments in the queue
            </p>
          </div>
          <div className="flex items-center gap-3">
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
            <div className="flex bg-[#171B24] rounded-lg p-1 shadow-sm border border-gray-800">
              {["all", "today", "upcoming"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                    filter === filterType
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={fadeIn}>
          <StatCard
            title="Total Appointments"
            value={queueStats.totalAppointments}
            icon={<Calendar className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Today's Appointments"
            value={queueStats.todayAppointments}
            icon={<Clock className="text-yellow-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-yellow-500/30"
            iconBg="bg-yellow-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Waiting"
            value={queueStats.waitingAppointments}
            icon={<User className="text-green-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-green-500/30"
            iconBg="bg-green-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="In Progress"
            value={queueStats.inProgressAppointments}
            icon={<Timer className="text-purple-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-purple-500/30"
            iconBg="bg-purple-600/20"
          />
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#0D1117] rounded-lg border border-gray-800 p-4 mb-6"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search doctor, department, reason..."
            className="w-full pl-10 pr-10 py-2 outline-none bg-[#171B24] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between bg-[#090B10]">
          <h2 className="text-lg font-semibold text-gray-100 mb-3 sm:mb-0">
            {filteredAppointments.length} Appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </h2>
          <Link
            to="/patient/book-appointment"
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book New Appointment
          </Link>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="hover:bg-[#171B24] transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleExpandAppointment(appointment._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white font-medium text-lg shadow-sm">
                        {appointment.queueInfo?.tokenNumber || "-"}
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-gray-100">
                          {appointment.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-400 capitalize">
                          {appointment.department}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.appointmentTime}
                          </div>
                          <div className="flex items-center text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={appointment.status} />
                      <ChevronDown
                        className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
                          expandedAppointment === appointment._id
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedAppointment === appointment._id && (
                  <div className="px-4 pb-4 pt-1 bg-[#0D1117]/70 border-t border-gray-800">
                    {appointment.queueInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Doctor Information
                          </h4>
                          <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Specialization
                                </p>
                                <p className="text-sm font-medium text-gray-300 capitalize">
                                  {appointment.doctor.specialization ||
                                    appointment.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Contact</p>
                                <p className="text-sm font-medium text-gray-300 flex items-center">
                                  <Phone className="h-3 w-3 mr-1 text-blue-400" />
                                  {appointment.doctor.contactNumber ||
                                    "Not available"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Queue Information
                          </h4>
                          <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Your Token
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.tokenNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Current Token
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.currentToken || "0"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Estimated Wait
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.estimatedWaitTime ||
                                    "Calculating..."}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Patients Ahead
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.patientsAhead || "0"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Appointment Details
                        </h4>
                        <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                          <p className="text-xs text-gray-500 mb-1">
                            Reason for Visit
                          </p>
                          <p className="text-sm text-gray-300">
                            {appointment.reason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-700">
                      <button
                        onClick={() => handleViewQueue(appointment._id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        View Queue Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-[#0D1117]">
            <Calendar className="w-16 h-16 text-gray-700 mb-3" />
            <h3 className="text-lg font-medium text-gray-200 mb-1">
              No appointments found
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              {searchQuery
                ? "No results match your search criteria"
                : filter === "today"
                ? "You don't have any appointments scheduled for today"
                : filter === "upcoming"
                ? "You don't have any upcoming appointments"
                : "You don't have any appointments scheduled"}
            </p>
            <Link
              to="/patient/book-appointment"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-300 flex items-center text-sm font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book New Appointment
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Supporting components
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
    <div className="mt-6 text-blue-400 font-medium">
      Loading appointments...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-100 mb-2">{error}</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      There was a problem loading your appointments. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between transition-all duration-300 hover:shadow-glow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <p className="text-xl font-bold mt-1 text-gray-100">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-700/30";
      case "in-progress":
        return "bg-green-900/30 text-green-300 border border-green-700/30 animate-pulse";
      case "completed":
        return "bg-blue-900/30 text-blue-300 border border-blue-700/30";
      case "cancelled":
        return "bg-red-900/30 text-red-300 border border-red-700/30";
      default:
        return "bg-gray-800 text-gray-300 border border-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default QueueStatus;
