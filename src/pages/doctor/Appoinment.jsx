import React, { useState, useEffect } from "react";
import axios from "axios";
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
    <div className=" max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500">Manage and view your appointments</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={`p-2 rounded-full transition-colors ${
              refreshing
                ? "bg-blue-100 text-blue-600 animate-spin"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-label="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isToday(selectedDate)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Appointments"
          value={statsData.total}
          icon={<Calendar className="text-blue-500" />}
          color="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-blue-200"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Scheduled"
          value={statsData.scheduled}
          icon={<Clock className="text-yellow-500" />}
          color="bg-gradient-to-br from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="In Progress"
          value={statsData.inProgress}
          icon={<User className="text-green-500" />}
          color="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
          iconBg="bg-green-100"
        />
        <StatCard
          title="Completed"
          value={statsData.completed}
          icon={<Timer className="text-purple-500" />}
          color="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Date selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isToday(selectedDate)
                  ? "Today"
                  : format(selectedDate, "EEEE, MMMM d, yyyy")}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showDatePicker && (
                <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-72">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => {
                        setSelectedDate(new Date());
                        setShowDatePicker(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-500" />
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                              ? "bg-blue-500 text-white"
                              : isToday(day)
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="text-xs mb-1">
                            {format(day, "EEE")}
                          </div>
                          <div
                            className={`text-lg font-medium ${
                              isSameDay(day, selectedDate) ? "text-white" : ""
                            }`}
                          >
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
            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "all"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("scheduled")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "scheduled"
                    ? "bg-white text-yellow-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilterStatus("in-progress")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "in-progress"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filterStatus === "completed"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Queue Information
          </h3>
          <div className="flex items-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
              Token {appointmentData?.queueStats?.currentToken || 0}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(), "h:mm a")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QueueStatCard
            label="Current Token"
            value={appointmentData?.queueStats?.currentToken || 0}
            color="bg-blue-50"
            textColor="text-blue-700"
            icon={<Clock className="w-4 h-4 text-blue-500" />}
          />
          <QueueStatCard
            label="Waiting"
            value={appointmentData?.queueStats?.waitingCount || 0}
            color="bg-yellow-50"
            textColor="text-yellow-700"
            icon={<User className="w-4 h-4 text-yellow-500" />}
          />
          <QueueStatCard
            label="In Progress"
            value={appointmentData?.queueStats?.inProgressCount || 0}
            color="bg-green-50"
            textColor="text-green-700"
            icon={<User className="w-4 h-4 text-green-500" />}
          />
          <QueueStatCard
            label="Completed"
            value={appointmentData?.queueStats?.completedCount || 0}
            color="bg-purple-50"
            textColor="text-purple-700"
            icon={<Calendar className="w-4 h-4 text-purple-500" />}
          />
          <QueueStatCard
            label="Avg. Time"
            value={`${
              appointmentData?.queueStats?.averageConsultationTime || 0
            } min`}
            color="bg-gray-50"
            textColor="text-gray-700"
            icon={<Timer className="w-4 h-4 text-gray-500" />}
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">
            {filteredAppointments.length} Appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients, reasons, departments..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleExpandAppointment(appointment._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium text-lg shadow-sm">
                        {appointment.queueInfo?.tokenNumber || "-"}
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-gray-800">
                          {appointment.patient.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {appointment.patient.email}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.scheduledTime}
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md capitalize flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {appointment.department}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={appointment.status} />
                      <ChevronDown
                        className={`ml-2 w-4 h-4 text-gray-400 transition-transform ${
                          expandedAppointment === appointment._id
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedAppointment === appointment._id && (
                  <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Patient Information
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Patient ID
                              </p>
                              <p className="text-sm font-medium">
                                {appointment.patient.patientId || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Contact</p>
                              <p className="text-sm font-medium flex items-center">
                                <Phone className="h-3 w-3 mr-1 text-blue-500" />
                                {appointment.patient.phone || "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Appointment Details
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">
                            Reason for Visit
                          </p>
                          <p className="text-sm">
                            {appointment.reason || "No reason provided"}
                          </p>
                        </div>
                      </div>

                      {appointment.queueInfo && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Queue Information
                          </h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Token Number
                                </p>
                                <p className="text-sm font-medium">
                                  {appointment.queueInfo.tokenNumber}
                                </p>
                              </div>
                              {appointment.queueInfo.actualStartTime && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Started At
                                  </p>
                                  <p className="text-sm font-medium">
                                    {appointment.queueInfo.actualStartTime}
                                  </p>
                                </div>
                              )}
                              {appointment.queueInfo.actualEndTime && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Ended At
                                  </p>
                                  <p className="text-sm font-medium">
                                    {appointment.queueInfo.actualEndTime}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-medium capitalize">
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
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No appointments found
            </h3>
            <p className="text-gray-500 mb-6 text-center">
              {searchQuery
                ? "No results match your search criteria"
                : `There are no appointments scheduled for ${format(
                    selectedDate,
                    "MMMM d, yyyy"
                  )}`}
            </p>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium">
              <PlusCircle className="w-4 h-4 mr-2" />
              Schedule New Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full animate-pulse opacity-70"></div>
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
    <div className="mt-6 text-blue-700 font-medium">
      Loading appointments...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">{error}</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      There was a problem loading your appointment data. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-600">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
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
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "in-progress":
        return "bg-green-100 text-green-800 border border-green-200 animate-pulse";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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
