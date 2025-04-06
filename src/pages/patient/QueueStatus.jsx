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

function QueueStatus() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'upcoming'
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const navigate = useNavigate();

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
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Queue Status</h1>
          <p className="text-gray-500">
            Monitor your appointments in the queue
          </p>
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
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {["all", "today", "upcoming"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  filter === filterType
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Appointments"
          value={queueStats.totalAppointments}
          icon={<Calendar className="text-blue-500" />}
          color="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-blue-200"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Today's Appointments"
          value={queueStats.todayAppointments}
          icon={<Clock className="text-yellow-500" />}
          color="bg-gradient-to-br from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Waiting"
          value={queueStats.waitingAppointments}
          icon={<User className="text-green-500" />}
          color="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
          iconBg="bg-green-100"
        />
        <StatCard
          title="In Progress"
          value={queueStats.inProgressAppointments}
          icon={<Timer className="text-purple-500" />}
          color="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search doctor, department, reason..."
            className="w-full pl-10 pr-10 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">
            {filteredAppointments.length} Appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </h2>
          <Link
            to="/patient"
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book New Appointment
          </Link>
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
                          {appointment.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {appointment.department}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.appointmentTime}
                          </div>
                          <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.date), "MMM d, yyyy")}
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
                    {appointment.queueInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Doctor Information
                          </h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Specialization
                                </p>
                                <p className="text-sm font-medium capitalize">
                                  {appointment.doctor.specialization ||
                                    appointment.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Contact</p>
                                <p className="text-sm font-medium flex items-center">
                                  <Phone className="h-3 w-3 mr-1 text-blue-500" />
                                  {appointment.doctor.contactNumber ||
                                    "Not available"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Queue Information
                          </h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Your Token
                                </p>
                                <p className="text-sm font-medium">
                                  {appointment.queueInfo.tokenNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Current Token
                                </p>
                                <p className="text-sm font-medium">
                                  {appointment.queueInfo.currentToken || "0"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Estimated Wait
                                </p>
                                <p className="text-sm font-medium">
                                  {appointment.queueInfo.estimatedWaitTime ||
                                    "Calculating..."}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Patients Ahead
                                </p>
                                <p className="text-sm font-medium">
                                  {appointment.queueInfo.patientsAhead || "0"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
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
                    )}

                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleViewQueue(appointment._id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center text-sm font-medium"
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
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No appointments found
            </h3>
            <p className="text-gray-500 mb-6 text-center">
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
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book New Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Supporting components
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

export default  QueueStatus;