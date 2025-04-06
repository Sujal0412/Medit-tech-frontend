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

function QueuePage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/patient/queue-status"
            className="mr-3 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Queue Details</h1>
            <p className="text-gray-500">Live status of your appointment</p>
          </div>
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
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Auto-refreshes every minute
          </span>
        </div>
      </div>

      {/* Doctor Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium text-lg shadow-sm mr-4">
              {appointment.doctor.name.split(" ")[0][0]}
              {appointment.doctor.name.split(" ")[1]
                ? appointment.doctor.name.split(" ")[1][0]
                : ""}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {appointment.doctor.name}
              </h2>
              <p className="text-gray-500 capitalize">
                {appointment.doctor.specialization || appointment.department}
              </p>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> Appointment Date
            </p>
            <p className="text-sm font-medium text-gray-800">{formattedDate}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Scheduled Time
            </p>
            <p className="text-sm font-medium text-gray-800">
              {appointment.appointmentTime}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <FileText className="w-3 h-3 mr-1" /> Department
            </p>
            <p className="text-sm font-medium text-gray-800 capitalize">
              {appointment.department}
            </p>
          </div>
        </div>
      </div>

      {/* Queue Information */}
      {appointment.queueInfo ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <QueueStatCard
              label="Your Token"
              value={appointment.queueInfo.tokenNumber || "N/A"}
              color="bg-blue-50"
              textColor="text-blue-700"
              icon={<User className="w-4 h-4 text-blue-500" />}
            />
            <QueueStatCard
              label="Current Token"
              value={appointment.queueInfo.currentToken || "0"}
              color="bg-green-50"
              textColor="text-green-700"
              icon={<Activity className="w-4 h-4 text-green-500" />}
            />
            <QueueStatCard
              label="Estimated Wait"
              value={appointment.queueInfo.waitingTime || "Calculating..."}
              color="bg-purple-50"
              textColor="text-purple-700"
              icon={<Timer className="w-4 h-4 text-purple-500" />}
            />
          </div>

          {/* Queue Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Queue Progress
              </h3>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                  {appointment.queueInfo.patientsAhead || 0} patient
                  {appointment.queueInfo.patientsAhead !== 1 ? "s" : ""} ahead
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(), "h:mm a")}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs text-gray-500">Queue Progress</div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>

          {/* Queue Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Queue Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Patients</p>
                <p className="text-sm font-medium text-gray-800">
                  {appointment.queueInfo.totalPatientsInQueue || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Completed</p>
                <p className="text-sm font-medium text-gray-800">
                  {appointment.queueInfo.completedPatients || "0"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Expected Start</p>
                <p className="text-sm font-medium text-gray-800">
                  {appointment.queueInfo.estimatedStartTime || "Calculating..."}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Avg. Consultation</p>
                <p className="text-sm font-medium text-gray-800">
                  {appointment.queueInfo.averageConsultationTime || "0"} min
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-col items-center justify-center py-8">
            <StopCircle className="w-16 h-16 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Queue information not available
            </h3>
            <p className="text-gray-500 mb-6 text-center">
              Queue information is not available for this appointment yet.
            </p>
          </div>
        </div>
      )}

      {/* Appointment Reason */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Appointment Details
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Reason for Visit
          </h4>
          <p className="text-gray-600">
            {appointment.reason || "No reason provided"}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
          <h4 className="font-medium">Important Information</h4>
        </div>
        <ul className="space-y-1 ml-7 list-disc text-blue-700">
          <li>
            Please arrive at least 10 minutes before your estimated start time
          </li>

          <li>Queue status updates automatically every minute</li>
        </ul>
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
      Loading appointment details...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">{error}</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      There was a problem loading your appointment details. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">
      Appointment Not Found
    </h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      We couldn't find the appointment you're looking for.
    </p>
    <Link
      to="/patient/queue-status"
      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
    >
      Back to Queue Status
    </Link>
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

export default QueuePage;
