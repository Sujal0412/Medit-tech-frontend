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
    <div className="h-full w-full max-w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Reception Dashboard
            </h1>
            <p className="text-gray-500">
              Manage patients, appointments, and hospital resources
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
            <Link
              to="/reception/manage-queue"
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Queue Management
            </Link>
            <button
              onClick={goToNewPatient}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 flex items-center gap-2 shrink-0 shadow-sm"
            >
              <UserPlus className="h-5 w-5" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Today's Patients"
            value={stats.todayPatients}
            icon={<Calendar className="text-blue-500" />}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
            borderColor="border-blue-200"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Available Beds"
            value={stats.availableBeds}
            icon={<Bed className="text-green-500" />}
            color="bg-gradient-to-br from-green-50 to-green-100"
            borderColor="border-green-200"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Queue Length"
            value={stats.queueLength}
            icon={<Users className="text-yellow-500" />}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100"
            borderColor="border-yellow-200"
            iconBg="bg-yellow-100"
          />
          <StatCard
            title="Doctors Available"
            value={stats.availableDoctors}
            icon={<UserCog className="text-purple-500" />}
            color="bg-gradient-to-br from-purple-50 to-purple-100"
            borderColor="border-purple-200"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Quick Actions
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              icon={<UserPlus className="h-6 w-6 text-blue-500 mb-2" />}
              title="Add New Patient"
              description="Register a new patient to the system"
              onClick={goToNewPatient}
              color="from-blue-50 via-blue-50 to-white"
              borderColor="border-blue-200"
              hoverColor="hover:bg-blue-50"
            />
            <ActionCard
              icon={<Building className="h-6 w-6 text-green-500 mb-2" />}
              title="Manage Beds"
              description="Assign or release patient beds"
              onClick={goToAssignBed}
              color="from-green-50 via-green-50 to-white"
              borderColor="border-green-200"
              hoverColor="hover:bg-green-50"
            />
            <ActionCard
              icon={<CalendarPlus className="h-6 w-6 text-purple-500 mb-2" />}
              title="New Appointment"
              description="Schedule patient appointments"
              onClick={goToNewAppointment}
              color="from-purple-50 via-purple-50 to-white"
              borderColor="border-purple-200"
              hoverColor="hover:bg-purple-50"
            />
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              Recent Patients
            </h3>
          </div>

          <div className="overflow-x-auto">
            {recentPatients.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Recent Patients
                </h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  There are no recent patient visits to display
                </p>
                <button
                  onClick={goToNewPatient}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Patient
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon, label;

  switch (status) {
    case "waiting":
    case "scheduled":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <Clock className="h-3.5 w-3.5 mr-1 text-yellow-600" />;
      label = status === "waiting" ? "Waiting" : "Scheduled";
      break;
    case "in-progress":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <Activity className="h-3.5 w-3.5 mr-1 text-blue-600" />;
      label = "In Progress";
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" />;
      label = "Completed";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1 text-gray-600" />;
      label = "Unknown";
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-full flex items-center w-fit ${bgColor} ${textColor} text-xs font-medium`}
    >
      {icon}
      {label}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-600">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
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
  <button
    onClick={onClick}
    className={`p-5 rounded-lg border ${borderColor} bg-gradient-to-br ${color} ${hoverColor} transition-all flex flex-col items-center text-center shadow-sm hover:shadow-md`}
  >
    {icon}
    <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
    <p className="text-xs text-gray-500">{description}</p>
  </button>
);

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
    <div className="mt-6 text-blue-700 font-medium">Loading dashboard...</div>
  </div>
);

export default Dashboard;
