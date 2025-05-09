import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/userContext";
import {
  Clock,
  User,
  Calendar,
  PlayCircle,
  StopCircle,
  Timer,
  AlertCircle,
  PlusCircle,
  FileText,
  RefreshCw,
  ChevronRight,
  CalendarClock,
  ClipboardCheck,
  BadgeAlert,
  ChevronDown,
  Mail,
  Phone,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";

function Dashboard() {
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedWaitingAppointment, setExpandedWaitingAppointment] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else if (!refreshing) setLoading(true);

      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/appointment/get-all-appoinment-doctor/${user.doctor}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointmentData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleStartConsultation = async (appointmentId) => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_URL}/api/appointment/start/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Error starting consultation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndConsultation = async (appointmentId) => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_URL}/api/appointment/complete/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Error ending consultation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandWaitingAppointment = (id) => {
    if (expandedWaitingAppointment === id) {
      setExpandedWaitingAppointment(null);
    } else {
      setExpandedWaitingAppointment(id);
    }
  };

  const filterWaitingPatients = (patients) => {
    if (!patients || !Array.isArray(patients)) return [];

    if (searchQuery) {
      return patients.filter(
        (apt) =>
          apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patient.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return patients;
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchAppointments} />;

  const currentPatient =
    appointmentData?.appointments?.inProgress?.[0] ||
    appointmentData?.appointments?.scheduled?.find(
      (apt) =>
        apt.queueInfo?.isCurrentPatient && apt.queueInfo?.status === "waiting"
    );

  const waitingPatients =
    appointmentData?.appointments?.scheduled?.filter(
      (apt) => !apt.queueInfo?.isCurrentPatient && apt.status === "scheduled"
    ) || [];

  const filteredWaitingPatients = filterWaitingPatients(waitingPatients);

  // Calculate completed percentage
  const totalAppointments = appointmentData?.appointmentCounts?.total || 0;
  const completedAppointments =
    appointmentData?.appointmentCounts?.completed || 0;
  const completedPercentage = totalAppointments
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Dashboard header */}
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, Dr. {user?.firstName || "Doctor"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAppointments(true)}
              className={`p-2 rounded-full transition-colors ${
                refreshing
                  ? "bg-blue-500/20 text-blue-400 animate-spin"
                  : "bg-[#171B24] text-gray-400 hover:bg-[#1F242E] hover:text-blue-400"
              }`}
              disabled={refreshing}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              to="/doctor/appointments"
              className="bg-[#171B24] border border-gray-800 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-300 hover:bg-[#1F242E] transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
              All Appointments
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
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
            title="Current Token"
            value={appointmentData?.queueStats?.currentToken || "-"}
            icon={<Clock className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Waiting"
            value={appointmentData?.queueStats?.waitingCount || 0}
            icon={<User className="text-cyan-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-cyan-500/30"
            iconBg="bg-cyan-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Completed"
            value={appointmentData?.queueStats?.completed || 0}
            icon={<Calendar className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Average Time"
            value={`${
              appointmentData?.queueStats?.averageConsultationTime || 0
            } min`}
            icon={<Timer className="text-cyan-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-cyan-500/30"
            iconBg="bg-cyan-600/20"
          />
        </motion.div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
      >
        {/* Daily Progress */}
        <motion.div
          variants={fadeIn}
          className="bg-[#0D1117] rounded-lg border border-gray-800 p-5"
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Daily Progress
          </h3>

          <div className="relative pt-1 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-blue-400">
                {completedPercentage}% Complete
              </div>
              <div className="text-xs text-gray-400">
                {completedAppointments} of {totalAppointments} appointments
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-800">
              <div
                style={{ width: `${completedPercentage}%` }}
                className="shadow-none flex flex-col whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DashboardStat
              label="Scheduled"
              value={appointmentData?.appointmentCounts?.scheduled || 0}
              icon={<CalendarClock className="w-4 h-4 text-blue-400" />}
              color="text-blue-400 bg-blue-500/10"
            />
            <DashboardStat
              label="In Progress"
              value={appointmentData?.appointmentCounts?.inProgress || 0}
              icon={<ClipboardCheck className="w-4 h-4 text-cyan-400" />}
              color="text-cyan-400 bg-cyan-500/10"
            />
          </div>
        </motion.div>

        {/* Next Appointment */}
        <motion.div
          variants={fadeIn}
          className="lg:col-span-2 bg-[#0D1117] rounded-lg border border-gray-800 p-5"
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Up Next</h3>

          {waitingPatients.length > 0 ? (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">
                {waitingPatients[0].queueInfo.tokenNumber}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-100">
                      {waitingPatients[0].patient.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Scheduled for {waitingPatients[0].scheduledTime}
                    </p>
                  </div>
                  <StatusBadge status={waitingPatients[0].status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-400">
                    <FileText className="w-3 h-3 mr-1" />
                    {waitingPatients[0].reason}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 capitalize">
                    <BadgeAlert className="w-3 h-3 mr-1" />
                    {waitingPatients[0].department}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-[#171B24] rounded-lg">
              <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No patients waiting</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Current Patient Card */}
      {currentPatient && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-[#0D1117] rounded-xl overflow-hidden mb-6 border border-gray-800 relative"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400"></div>
          <div className="p-6 pl-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mr-3">
                  <User className="text-blue-400 w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-100">
                  Current Consultation
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {currentPatient.queueInfo?.actualStartTime && (
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                    Started: {currentPatient.queueInfo.actualStartTime}
                  </span>
                )}
                <StatusBadge status={currentPatient.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-[#171B24] p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <User className="w-3 h-3 mr-1" /> Patient Name
                  </p>
                  <p className="text-md font-semibold text-gray-100">
                    {currentPatient.patient.name}
                  </p>
                </div>
                <div className="bg-[#171B24] p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Token Number
                  </p>
                  <p className="text-md font-semibold text-gray-100">
                    {currentPatient.queueInfo.tokenNumber}
                  </p>
                </div>
                <div className="bg-[#171B24] p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Scheduled Time
                  </p>
                  <p className="text-md font-semibold text-gray-100">
                    {currentPatient.scheduledTime}
                  </p>
                </div>
                <div className="bg-[#171B24] p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> Department
                  </p>
                  <p className="text-md font-semibold text-gray-100 capitalize">
                    {currentPatient.department}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                {currentPatient.status === "scheduled" ||
                currentPatient.status === "waiting" ? (
                  <button
                    onClick={() => handleStartConsultation(currentPatient._id)}
                    className="w-full flex gap-2 items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 group"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Consultation
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEndConsultation(currentPatient._id)}
                    className="w-full flex gap-2 items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-300 group"
                  >
                    <StopCircle className="w-5 h-5" />
                    End Consultation
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 bg-[#171B24] p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Consultation Reason
              </h4>
              <p className="text-gray-400">{currentPatient.reason}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Waiting List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-6"
      >
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between bg-[#090B10]">
          <h2 className="text-lg font-semibold text-gray-100 mb-3 sm:mb-0">
            Waiting List ({filteredWaitingPatients.length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients, reasons..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
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
            <Link
              to="/doctor/appointments"
              className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View All
            </Link>
          </div>
        </div>

        {filteredWaitingPatients.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {filteredWaitingPatients.map((appointment) => (
              <div
                key={appointment._id}
                className="hover:bg-[#171B24] transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    handleExpandWaitingAppointment(appointment._id)
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white font-medium text-lg shadow-sm">
                        {appointment.queueInfo?.tokenNumber || "-"}
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-gray-100">
                          {appointment.patient.name}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {appointment.patient.email || "No email provided"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.scheduledTime}
                          </div>
                          <div className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-md capitalize flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {appointment.department}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={appointment.status} />
                      <ChevronDown
                        className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
                          expandedWaitingAppointment === appointment._id
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedWaitingAppointment === appointment._id && (
                  <div className="px-4 pb-4 pt-1 bg-[#0D1117]/70 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Patient Information
                        </h4>
                        <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Patient ID
                              </p>
                              <p className="text-sm font-medium text-gray-300">
                                {appointment.patient.patientId || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Contact</p>
                              <p className="text-sm font-medium text-gray-300 flex items-center">
                                <Phone className="h-3 w-3 mr-1 text-blue-400" />
                                {appointment.patient.phone || "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

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

                      {appointment.queueInfo && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Queue Information
                          </h4>
                          <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Token Number
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.tokenNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Queue Position
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {filteredWaitingPatients.findIndex(
                                    (apt) => apt._id === appointment._id
                                  ) + 1}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-medium text-gray-300 capitalize">
                                  {appointment.queueInfo.status || "waiting"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
              No patients waiting
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              {searchQuery
                ? "No results match your search criteria"
                : "All patients have been attended to"}
            </p>
            <Link
              to="/doctor/appointments"
              className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View All Appointments
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const DashboardStat = ({ label, value, icon, color }) => (
  <div className="flex items-center p-3 bg-[#171B24] border border-gray-700 rounded-lg">
    <div
      className={`w-8 h-8 rounded-full ${color} flex items-center justify-center mr-3`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-100">{value}</p>
    </div>
  </div>
);

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
      Loading your dashboard...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-100 mb-2">{error}</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      There was a problem loading your dashboard. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
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

export default Dashboard;
