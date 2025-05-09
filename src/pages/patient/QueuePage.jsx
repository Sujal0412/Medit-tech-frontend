import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  Timer,
  ArrowLeft,
  FileText,
  Phone,
  ChevronLeft,
  Activity,
  StopCircle,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function QueuePage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    visible: { transition: { staggerChildren: 0.15 } },
  };

  useEffect(() => {
    fetchAppointment();
    // Auto refresh every minute
    const interval = setInterval(() => fetchAppointment(true), 60000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAppointment = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/appointment/get-appoinement-detail-patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointment(response.data.appointment);
      setError(null);
    } catch (error) {
      setError("Failed to load appointment details. Please try again.");
      console.error("Error fetching appointment:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchAppointment(true);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchAppointment} />;
  if (!appointment) return <NotFoundState />;

  // Calculate progress percentage
  const progressPercentage = appointment.queueInfo
    ? Math.min(
        100,
        Math.max(
          0,
          (appointment.queueInfo.currentToken /
            appointment.queueInfo.tokenNumber) *
            100
        )
      )
    : 0;

  // Format date
  const formattedDate = appointment.date
    ? format(new Date(appointment.date), "EEEE, MMMM d, yyyy")
    : "Date not available";

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/patient/queue-status"
              className="mr-3 p-2 rounded-full bg-[#171B24] text-gray-400 hover:bg-[#1F242E] hover:text-blue-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Queue Details</h1>
              <p className="text-gray-400">Live status of your appointment</p>
            </div>
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
            <span className="hidden md:block text-sm text-gray-500 bg-[#171B24] px-3 py-1 rounded-full border border-gray-800">
              Auto-refreshes every minute
            </span>
          </div>
        </div>
      </motion.div>

      {/* Doctor Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#0D1117] rounded-xl overflow-hidden mb-6 border border-gray-800 relative"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400"></div>
        <div className="p-6 pl-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white font-medium text-lg shadow-sm mr-4">
                {appointment.doctor.name.split(" ")[0][0]}
                {appointment.doctor.name.split(" ")[1]
                  ? appointment.doctor.name.split(" ")[1][0]
                  : ""}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  {appointment.doctor.name}
                </h2>
                <p className="text-gray-400 capitalize">
                  {appointment.doctor.specialization || appointment.department}
                </p>
              </div>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-[#171B24] p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Appointment Date
              </p>
              <p className="text-sm font-medium text-gray-300">
                {formattedDate}
              </p>
            </div>
            <div className="bg-[#171B24] p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Scheduled Time
              </p>
              <p className="text-sm font-medium text-gray-300">
                {appointment.appointmentTime}
              </p>
            </div>
            <div className="bg-[#171B24] p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center">
                <FileText className="w-3 h-3 mr-1" /> Department
              </p>
              <p className="text-sm font-medium text-gray-300 capitalize">
                {appointment.department}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue Information */}
      {appointment.queueInfo ? (
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <QueueStatCard
              label="Your Token"
              value={appointment.queueInfo.tokenNumber || "N/A"}
              color="bg-blue-600/20"
              textColor="text-blue-300"
              icon={<User className="w-4 h-4 text-blue-400" />}
            />
            <QueueStatCard
              label="Current Token"
              value={appointment.queueInfo.currentToken || "0"}
              color="bg-green-600/20"
              textColor="text-green-300"
              icon={<Activity className="w-4 h-4 text-green-400" />}
            />
            <QueueStatCard
              label="Estimated Wait"
              value={appointment.queueInfo.waitingTime || "Calculating..."}
              color="bg-purple-600/20"
              textColor="text-purple-300"
              icon={<Timer className="w-4 h-4 text-purple-400" />}
            />
          </motion.div>

          {/* Queue Progress */}
          <motion.div
            variants={fadeIn}
            className="bg-[#0D1117] rounded-lg border border-gray-800 p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Queue Progress
              </h3>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium mr-2 border border-blue-800/30">
                  {appointment.queueInfo.patientsAhead || 0} patient
                  {appointment.queueInfo.patientsAhead !== 1 ? "s" : ""} ahead
                </span>
                <span className="text-sm text-gray-400">
                  {format(new Date(), "h:mm a")}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs text-gray-500">Queue Progress</div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-[#171B24]">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Queue Details */}
          <motion.div
            variants={fadeIn}
            className="bg-[#0D1117] rounded-lg border border-gray-800 p-5 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Queue Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#171B24] p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Patients</p>
                <p className="text-sm font-medium text-gray-300">
                  {appointment.queueInfo.totalPatientsInQueue || "N/A"}
                </p>
              </div>
              <div className="bg-[#171B24] p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Completed</p>
                <p className="text-sm font-medium text-gray-300">
                  {appointment.queueInfo.completedPatients || "0"}
                </p>
              </div>
              <div className="bg-[#171B24] p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Expected Start</p>
                <p className="text-sm font-medium text-gray-300">
                  {appointment.queueInfo.estimatedStartTime || "Calculating..."}
                </p>
              </div>
              <div className="bg-[#171B24] p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Avg. Consultation</p>
                <p className="text-sm font-medium text-gray-300">
                  {appointment.queueInfo.averageConsultationTime || "0"} min
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 p-5 mb-6"
        >
          <div className="flex flex-col items-center justify-center py-8">
            <StopCircle className="w-16 h-16 text-gray-700 mb-3" />
            <h3 className="text-lg font-medium text-gray-200 mb-1">
              Queue information not available
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Queue information is not available for this appointment yet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Appointment Reason */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#0D1117] rounded-lg border border-gray-800 p-5 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Appointment Details
        </h3>
        <div className="bg-[#171B24] p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Reason for Visit
          </h4>
          <p className="text-gray-400">
            {appointment.reason || "No reason provided"}
          </p>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-blue-300 text-sm mb-6"
      >
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
          <h4 className="font-medium">Important Information</h4>
        </div>
        <ul className="space-y-1 ml-7 list-disc text-blue-300">
          <li>
            Please arrive at least 10 minutes before your estimated start time
          </li>
          <li>Queue status updates automatically every minute</li>
        </ul>
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
      Loading appointment details...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-100 mb-2">{error}</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      There was a problem loading your appointment details. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-100 mb-2">
      Appointment Not Found
    </h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      We couldn't find the appointment you're looking for.
    </p>
    <Link
      to="/patient/queue-status"
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Back to Queue Status
    </Link>
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

const QueueStatCard = ({ label, value, color, textColor, icon }) => (
  <div
    className={`${color} rounded-lg p-4 flex items-center border border-gray-800/50`}
  >
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
    </div>
  </div>
);

export default QueuePage;
