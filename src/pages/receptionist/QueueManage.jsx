import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Users,
  Clock,
  UserPlus,
  Search,
  PlayCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  User,
  Timer,
  ChevronDown,
  X,
  AlertCircle,
  Shield,
  ClipboardCheck,
  Building,
  ArrowRight,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import WithAuthRedirect from "../../components/withAuthRedirect ";

function QueueManagement() {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({
    totalQueues: 0,
    totalPatients: 0,
    waitingPatients: 0,
    inProgressPatients: 0,
    completedPatients: 0,
  });
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchQueueData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else if (!refreshing) setLoading(true);

      // Add department filter if selected
      const params = {};
      if (filters.department !== "all") {
        params.department = filters.department;
      }

      // Get all queues for today
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointment/today`,
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setQueues(response.data.queues);
      setStats(response.data.stats);
      setDepartmentStats(response.data.departmentStats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch queue data");
      console.error("Error fetching queue data:", err);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchQueueData(true);
  };

  // Apply search filter across all queues
  const filteredQueues = queues.filter((queue) => {
    // Skip filtering if search is empty
    if (!search) return true;

    // Check if doctor name or specialization matches
    const doctorMatches =
      queue.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      queue.doctor.specialization.toLowerCase().includes(search.toLowerCase());

    // Check if current patient matches (if exists)
    const patientMatches =
      queue.currentPatient &&
      queue.currentPatient.patientName
        .toLowerCase()
        .includes(search.toLowerCase());

    return doctorMatches || patientMatches;
  });

  const handleAddToQueue = () => {
    navigate("/reception/add-patient");
  };

  const handleViewQueue = (queueId) => {
    navigate(`/reception/queue/${queueId}`);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchQueueData} />;

  return (
    <div className="h-full w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Queue Dashboard
            </h1>
            <p className="text-gray-500">
              Overview of all department queues and patient status
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
              to="/reception/check-bed"
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Building className="w-4 h-4 mr-2 text-blue-500" />
              Bed Management
            </Link>
            <button
              onClick={handleAddToQueue}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 flex items-center gap-2 shrink-0 shadow-sm"
            >
              <UserPlus className="h-5 w-5" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Queues"
            value={stats.totalQueues}
            icon={<Calendar className="text-blue-500" />}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
            borderColor="border-blue-200"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="text-indigo-500" />}
            color="bg-gradient-to-br from-indigo-50 to-indigo-100"
            borderColor="border-indigo-200"
            iconBg="bg-indigo-100"
          />
          <StatCard
            title="Waiting"
            value={stats.waitingPatients}
            icon={<Clock className="text-yellow-500" />}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100"
            borderColor="border-yellow-200"
            iconBg="bg-yellow-100"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressPatients}
            icon={<User className="text-green-500" />}
            color="bg-gradient-to-br from-green-50 to-green-100"
            borderColor="border-green-200"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Completed"
            value={stats.completedPatients}
            icon={<Timer className="text-purple-500" />}
            color="bg-gradient-to-br from-purple-50 to-purple-100"
            borderColor="border-purple-200"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Department Stats */}
        {Object.keys(departmentStats).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Department Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(departmentStats).map(([dept, stats]) => (
                <div
                  key={dept}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">
                        {dept}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {stats.doctorCount} doctors
                      </p>
                    </div>
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-yellow-50 rounded p-1 border border-yellow-100">
                      <span className="text-xs text-gray-500 block">
                        Waiting
                      </span>
                      <span className="font-semibold text-yellow-700">
                        {stats.waitingCount}
                      </span>
                    </div>
                    <div className="bg-green-50 rounded p-1 border border-green-100">
                      <span className="text-xs text-gray-500 block">
                        Active
                      </span>
                      <span className="font-semibold text-green-700">
                        {stats.inProgressCount}
                      </span>
                    </div>
                    <div className="bg-blue-50 rounded p-1 border border-blue-100">
                      <span className="text-xs text-gray-500 block">Done</span>
                      <span className="font-semibold text-blue-700">
                        {stats.completedCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by doctor name, department, or patient..."
              className="w-full pl-10 pr-10 py-2 outline-none border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Queue Cards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Active Queues
          </h2>

          {filteredQueues.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredQueues.map((queue) => (
                <div
                  key={queue._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">
                          {queue.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {queue.doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white rounded-lg px-3 py-1 border border-gray-200 text-sm font-medium flex items-center gap-1 shadow-sm">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        <span>Queue {queue.currentToken || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                        <span className="text-xs text-gray-500 block">
                          Total
                        </span>
                        <span className="font-semibold text-gray-700">
                          {queue.totalPatients}
                        </span>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-100">
                        <span className="text-xs text-gray-500 block">
                          Waiting
                        </span>
                        <span className="font-semibold text-yellow-700">
                          {queue.waitingCount}
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center border border-green-100">
                        <span className="text-xs text-gray-500 block">
                          In Progress
                        </span>
                        <span className="font-semibold text-green-700">
                          {queue.inProgressCount}
                        </span>
                      </div>
                    </div>

                    {queue.currentPatient ? (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              Current Patient
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {queue.currentPatient.patientName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {queue.currentPatient.reason}
                            </p>
                          </div>
                          <div className="bg-blue-100 rounded-full px-2 py-1 text-xs font-medium text-blue-800">
                            Token {queue.currentPatient.tokenNumber}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                          No patient currently being seen
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Last updated:{" "}
                        {new Date(queue.lastUpdated).toLocaleTimeString()}
                      </div>
                      <button
                        onClick={() => handleViewQueue(queue._id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-md hover:from-blue-600 hover:to-cyan-500 cursor-pointer flex items-center text-sm shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Queue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Users className="w-16 h-16 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No queues found
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                {search
                  ? "No queues match your search criteria"
                  : "There are no active queues today"}
              </p>
              <button
                onClick={handleAddToQueue}
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
  );
}

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
    <div className="mt-6 text-blue-700 font-medium">Loading queue data...</div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">{error}</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      There was a problem loading the queue data. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

export default QueueManagement;
