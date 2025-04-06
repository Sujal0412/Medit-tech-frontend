import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Activity,
  FileText,
  Phone,
  ChevronRight,
  SkipForward,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  MapPin,
  Loader,
  Heart,
  Pill,
  CalendarCheck,
  PlusCircle,
  Search,
  X,
  CalendarClock,
  ClipboardCheck,
  BadgeAlert,
  ChevronDown,
} from "lucide-react";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every minute if there's a queue today
    const interval = setInterval(() => {
      if (dashboardData?.todayQueue) {
        fetchDashboardData(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [dashboardData?.todayQueue]);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/patient/dashboard/info`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load your dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExpandAppointment = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  const filterAppointments = () => {
    if (
      !dashboardData?.appointments ||
      !Array.isArray(dashboardData.appointments)
    )
      return [];

    if (searchQuery) {
      return dashboardData.appointments.filter(
        (apt) =>
          apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return dashboardData.appointments;
  };

  if (loading) {
    return <LoadingState />;
  }

  const filteredAppointments = filterAppointments();
  const appointmentsToday =
    dashboardData?.appointments?.filter((apt) => apt.isToday) || [];
  const appointmentStats = {
    upcoming: dashboardData?.appointments?.length || 0,
    today: appointmentsToday.length,
    completed: dashboardData?.recentConsultations?.length || 0,
    token: dashboardData?.todayQueue?.tokenNumber || "-",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Patient Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome, {dashboardData?.patient?.name?.split(" ")[0]}. Manage
              your appointments and health information.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => fetchDashboardData(true)}
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
            <Link
              to="/patient/appointments"
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              All Appointments
            </Link>
            <button
              onClick={() => navigate("/patient/book-appointment")}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 flex items-center gap-2 shrink-0 shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Your Token"
            value={appointmentStats.token}
            icon={<Clock className="text-blue-500" />}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
            borderColor="border-blue-200"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Appointments Today"
            value={appointmentStats.today}
            icon={<CalendarCheck className="text-yellow-500" />}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100"
            borderColor="border-yellow-200"
            iconBg="bg-yellow-100"
          />
          <StatCard
            title="Upcoming"
            value={appointmentStats.upcoming}
            icon={<Calendar className="text-green-500" />}
            color="bg-gradient-to-br from-green-50 to-green-100"
            borderColor="border-green-200"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Recent Visits"
            value={appointmentStats.completed}
            icon={<CheckCircle className="text-purple-500" />}
            color="bg-gradient-to-br from-purple-50 to-purple-100"
            borderColor="border-purple-200"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Patient Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              Patient Information
            </h3>

            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-lg text-gray-800 mb-1">
                  {dashboardData?.patient?.name}
                </h4>
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  ID: {dashboardData?.patient?.patientId}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Age & Gender"
                value={`${dashboardData?.patient?.age} Years, ${dashboardData?.patient?.gender}`}
              />
              <InfoItem
                icon={<Activity className="h-4 w-4" />}
                label="Blood Group"
                value={dashboardData?.patient?.bloodGroup}
              />
              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={dashboardData?.patient?.contactNumber}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <DashboardStat
                label="Upcoming Appts"
                value={appointmentStats.upcoming}
                icon={<CalendarClock className="w-4 h-4 text-blue-500" />}
                color="text-blue-500 bg-blue-50"
              />
              <DashboardStat
                label="Medical Records"
                value={appointmentStats.completed}
                icon={<ClipboardCheck className="w-4 h-4 text-green-500" />}
                color="text-green-500 bg-green-50"
              />
            </div>
          </div>

          {/* Today's Queue */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-200 flex justify-between items-center">
              <h2 className="font-semibold text-blue-800 flex items-center">
                <SkipForward className="mr-2 h-5 w-5" />
                Today's Appointment Queue
              </h2>
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className={`p-1 rounded-full ${
                  refreshing ? "animate-spin" : ""
                }`}
              >
                <RefreshCw className="h-4 w-4 text-blue-600" />
              </button>
            </div>

            {dashboardData?.todayQueue ? (
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div
                        className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(
                          dashboardData.todayQueue.status,
                          dashboardData.todayQueue.isMyTurn
                        )}`}
                      >
                        {getStatusIcon(
                          dashboardData.todayQueue.status,
                          dashboardData.todayQueue.isMyTurn
                        )}
                        <span className="ml-2 font-medium">
                          {dashboardData.todayQueue.isMyTurn
                            ? "It's Your Turn!"
                            : dashboardData.todayQueue.status === "waiting"
                            ? `Waiting: ${dashboardData.todayQueue.patientsAhead} ahead of you`
                            : dashboardData.todayQueue.status === "in-progress"
                            ? "Your consultation is in progress"
                            : "Status unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-1.5 h-4 w-4 text-gray-500" />
                        <span>
                          Estimated wait time:{" "}
                          {dashboardData.todayQueue.waitingTime}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1.5 h-4 w-4 text-gray-500" />
                        <span>
                          Expected start:{" "}
                          {dashboardData.todayQueue.estimatedStartTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Your Token
                      </div>
                      <div className="text-2xl font-bold text-blue-600 bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">
                        {dashboardData.todayQueue.tokenNumber}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Current</div>
                      <div className="text-2xl font-bold text-green-600 bg-green-50 rounded-lg px-4 py-2 border border-green-100">
                        {dashboardData.todayQueue.currentToken}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Appointments Today
                </h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  You don't have any appointments scheduled for today
                </p>
                <button
                  onClick={() => navigate("/patient/book-appointment")}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Book an Appointment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Upcoming Appointments ({filteredAppointments.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search doctor, department, reason..."
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
              <Link
                to="/patient/appointments"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View All
              </Link>
            </div>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    appointment.isToday ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleExpandAppointment(appointment._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mr-3 bg-gray-100 rounded-full p-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800">
                              {appointment.doctor.name}
                            </h3>
                            <span className="mx-2">•</span>
                            <span className="text-sm text-gray-600">
                              {appointment.doctor.specialization}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {appointment.formattedDate} at {appointment.time}
                          </div>
                          <div className="mt-1.5 flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1" />
                            <span className="text-xs text-gray-500">
                              {appointment.department || "General"} Department
                            </span>
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
                            Doctor Information
                          </h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">
                              Specialization
                            </p>
                            <p className="text-sm font-medium">
                              {appointment.doctor.specialization}
                            </p>
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
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() =>
                            navigate(`/patient/appointment/${appointment._id}`)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No Upcoming Appointments
              </h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                {searchQuery
                  ? "No appointments match your search criteria"
                  : "You don't have any upcoming appointments scheduled"}
              </p>
              <button
                onClick={() => navigate("/patient/book-appointment")}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Bottom Grid - Quick Actions and Recent Consultations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <QuickActionButton
                icon={<PlusCircle className="w-4 h-4 text-blue-500" />}
                label="Book New Appointment"
                onClick={() => navigate("/patient/book-appointment")}
              />
              <QuickActionButton
                icon={<FileText className="w-4 h-4 text-green-500" />}
                label="View Medical Records"
                onClick={() => navigate("/patient/medical-history")}
              />
              <QuickActionButton
                icon={<Pill className="w-4 h-4 text-purple-500" />}
                label="My Prescriptions"
                onClick={() => navigate("/patient/prescriptions")}
              />
              <QuickActionButton
                icon={<Heart className="w-4 h-4 text-red-500" />}
                label="Update Health Profile"
                onClick={() => navigate("/patient/profile")}
              />
            </div>
          </div>

          {/* Recent Consultations */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                Recent Consultations
              </h2>
              <button
                className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                onClick={() => navigate("/patient/medical-history")}
              >
                View History <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {dashboardData?.recentConsultations?.length > 0 ? (
                dashboardData.recentConsultations.map((record) => (
                  <div key={record._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-gray-800 font-medium">
                          {record.doctor.name}
                        </h4>
                        <p className="text-sm text-blue-600">
                          {record.doctor.specialization}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {record.date}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {record.reason.length > 60
                        ? `${record.reason.substring(0, 60)}...`
                        : record.reason}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    No previous consultations found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for queue card
const getStatusColor = (status, isMyTurn) => {
  if (isMyTurn) return "bg-green-100 text-green-800";
  if (status === "waiting") return "bg-yellow-100 text-yellow-800";
  if (status === "in-progress") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status, isMyTurn) => {
  if (isMyTurn) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (status === "waiting")
    return <Clock className="h-5 w-5 text-yellow-600" />;
  if (status === "in-progress")
    return <Activity className="h-5 w-5 text-blue-600" />;
  return <AlertCircle className="h-5 w-5 text-gray-500" />;
};

// Loading State Component
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
      Loading your dashboard...
    </div>
  </div>
);

// Status Badge Component
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

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center text-sm">
    <div className="text-gray-500 mr-2">{icon}</div>
    <div className="flex-1">
      <span className="text-gray-500">{label}: </span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  </div>
);

// Dashboard Stat Component
const DashboardStat = ({ label, value, icon, color }) => (
  <div className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
    <div
      className={`w-8 h-8 rounded-full ${color} flex items-center justify-center mr-3`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// Stat Card Component
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

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center text-gray-800 border border-gray-100"
  >
    <div className="mr-3">{icon}</div>
    {label}
  </button>
);

export default Dashboard;
