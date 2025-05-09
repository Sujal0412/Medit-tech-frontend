import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  Calendar,
  AlertCircle,
  Search,
  Timer,
  ArrowLeft,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  RefreshCw,
  FileText,
  Phone,
  Mail,
  ChevronDown,
  X,
  Clipboard,
  PlusCircle,
} from "lucide-react";
import {
  format,
  isSameDay,
  isToday,
  isThisWeek,
  addDays,
  subDays,
} from "date-fns";
import { useUser } from "../../context/userContext";

function Appointment() {
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, user, filterStatus]);

  const fetchAppointments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/appointment/get-all-appoinment-doctor/${
          user.doctor
        }?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointmentData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleDateChange = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const handleManualRefresh = () => {
    fetchAppointments(true);
  };

  const filterAppointments = (appointments) => {
    if (!appointments) return [];

    let filtered = appointments;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleExpandAppointment = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchAppointments} />;

  const allAppointments = Object.entries(
    appointmentData.appointments || {}
  ).flatMap(([status, appointments]) => appointments);

  const filteredAppointments = filterAppointments(allAppointments);

  // Quick stats
  const statsData = {
    total: appointmentData?.appointmentCounts?.total || 0,
    scheduled: appointmentData?.appointmentCounts?.scheduled || 0,
    inProgress: appointmentData?.appointmentCounts?.inProgress || 0,
    completed: appointmentData?.appointmentCounts?.completed || 0,
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Appointments</h1>
            <p className="text-gray-400">Manage and view your appointments</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className={`p-2 rounded-full transition-colors ${
                refreshing
                  ? "bg-blue-500/20 text-blue-400 animate-spin"
                  : "bg-[#171B24] text-gray-400 hover:bg-[#1F242E] hover:text-blue-400"
              }`}
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isToday(selectedDate)
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "bg-[#171B24] text-gray-300 hover:bg-[#1F242E]"
              }`}
            >
              Today
            </button>
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
            title="Total Appointments"
            value={statsData.total}
            icon={<Calendar className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Scheduled"
            value={statsData.scheduled}
            icon={<Clock className="text-cyan-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-cyan-500/30"
            iconBg="bg-cyan-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="In Progress"
            value={statsData.inProgress}
            icon={<User className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Completed"
            value={statsData.completed}
            icon={<Timer className="text-cyan-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-cyan-500/30"
            iconBg="bg-cyan-600/20"
          />
        </motion.div>
      </motion.div>

      {/* Date selector */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-[#0D1117] rounded-lg border border-gray-800 p-4 mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isToday(selectedDate)
                  ? "Today"
                  : format(selectedDate, "EEEE, MMMM d, yyyy")}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showDatePicker && (
                <div className="absolute z-10 mt-1 bg-[#171B24] rounded-lg shadow-lg border border-gray-700 p-3 w-72">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => {
                        setSelectedDate(new Date());
                        setShowDatePicker(false);
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="p-1 rounded-full hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        setSelectedDate(new Date(e.target.value));
                        setShowDatePicker(false);
                      }}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(7)].map((_, i) => {
                      const day = addDays(new Date(), i - 3);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedDate(day);
                            setShowDatePicker(false);
                          }}
                          className={`p-2 rounded-lg text-center ${
                            isSameDay(day, selectedDate)
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                              : isToday(day)
                              ? "bg-blue-900/20 text-blue-400"
                              : "hover:bg-gray-800"
                          }`}
                        >
                          <div className="text-xs mb-1">
                            {format(day, "EEE")}
                          </div>
                          <div className="text-lg font-medium">
                            {format(day, "d")}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-[#171B24] rounded-lg">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("scheduled")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "scheduled"
                    ? "bg-gradient-to-r from-yellow-600/70 to-yellow-500/70 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilterStatus("in-progress")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "in-progress"
                    ? "bg-gradient-to-r from-green-600/70 to-green-500/70 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "completed"
                    ? "bg-gradient-to-r from-purple-600/70 to-purple-500/70 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue Stats Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-[#0D1117] rounded-lg border border-gray-800 p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">
            Queue Information
          </h3>
          <div className="flex items-center">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium mr-2">
              Token {appointmentData?.queueStats?.currentToken || 0}
            </span>
            <span className="text-sm text-gray-400">
              {format(new Date(), "h:mm a")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QueueStatCard
            label="Current Token"
            value={appointmentData?.queueStats?.currentToken || 0}
            color="bg-blue-600/20"
            textColor="text-blue-300"
            icon={<Clock className="w-4 h-4 text-blue-400" />}
          />
          <QueueStatCard
            label="Waiting"
            value={appointmentData?.queueStats?.waitingCount || 0}
            color="bg-yellow-600/20"
            textColor="text-yellow-300"
            icon={<User className="w-4 h-4 text-yellow-400" />}
          />
          <QueueStatCard
            label="In Progress"
            value={appointmentData?.queueStats?.inProgressCount || 0}
            color="bg-green-600/20"
            textColor="text-green-300"
            icon={<User className="w-4 h-4 text-green-400" />}
          />
          <QueueStatCard
            label="Completed"
            value={appointmentData?.queueStats?.completedCount || 0}
            color="bg-purple-600/20"
            textColor="text-purple-300"
            icon={<Calendar className="w-4 h-4 text-purple-400" />}
          />
          <QueueStatCard
            label="Avg. Time"
            value={`${
              appointmentData?.queueStats?.averageConsultationTime || 0
            } min`}
            color="bg-gray-600/20"
            textColor="text-gray-300"
            icon={<Timer className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between bg-[#090B10]">
          <h2 className="text-lg font-semibold text-gray-100 mb-3 sm:mb-0">
            {filteredAppointments.length} Appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients, reasons..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>
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
                          {appointment.patient.name}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {appointment.patient.email}
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Token Number
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {appointment.queueInfo.tokenNumber}
                                </p>
                              </div>
                              {appointment.queueInfo.actualStartTime && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Started At
                                  </p>
                                  <p className="text-sm font-medium text-gray-300">
                                    {appointment.queueInfo.actualStartTime}
                                  </p>
                                </div>
                              )}
                              {appointment.queueInfo.actualEndTime && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Ended At
                                  </p>
                                  <p className="text-sm font-medium text-gray-300">
                                    {appointment.queueInfo.actualEndTime}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-medium text-gray-300 capitalize">
                                  {appointment.queueInfo.status}
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
              No appointments found
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              {searchQuery
                ? "No results match your search criteria"
                : `There are no appointments scheduled for ${format(
                    selectedDate,
                    "MMMM d, yyyy"
                  )}`}
            </p>
            <button className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium">
              <PlusCircle className="w-4 h-4 mr-2" />
              Schedule New Appointment
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

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
      There was a problem loading your appointment data. Please try again.
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

const QueueStatCard = ({ label, value, color, textColor, icon }) => (
  <div className={`${color} rounded-lg p-4 flex items-center`}>
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
    </div>
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

export default Appointment;
