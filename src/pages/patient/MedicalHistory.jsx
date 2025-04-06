import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  FileText,
  Filter,
  ChevronDown,
  CalendarDays,
  User,
  Timer,
  CheckCircle,
  Shield,
  Layers,
  Pill,
  Activity,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";
import WithAuthRedirect from "../../components/withAuthRedirect ";

function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointment/medical-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecords(response.data.records);
      setError(null);
    } catch (error) {
      setError("Failed to load medical history. Please try again.");
      console.error("Error fetching medical history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchMedicalHistory(true);
  };

  const handleExpandRecord = (id) => {
    if (expandedRecord === id) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(id);
    }
  };

  const filterRecords = () => {
    if (!records) return [];

    return records.filter((record) => {
      // Filter by search query
      const matchesSearch = searchQuery
        ? record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Filter by tab
      let matchesTab = true;
      if (activeTab !== "all") {
        matchesTab = record.status === activeTab;
      }

      return matchesSearch && matchesTab;
    });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchMedicalHistory} />;

  const filteredRecords = filterRecords();

  // Group records by month and year
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const date = new Date(record.date);
    const monthYear = format(date, "MMMM yyyy");
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(record);
    return groups;
  }, {});

  // Calculate stats
  const stats = {
    total: records.length,
    completed: records.filter((r) => r.status === "completed").length,
    scheduled: records.filter((r) => r.status === "scheduled").length,
    inProgress: records.filter((r) => r.status === "in-progress").length,
  };

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical History</h1>
          <p className="text-gray-500">
            View your past consultations and medical records
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Records"
          value={stats.total}
          icon={<Layers className="text-blue-500" />}
          color="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-blue-200"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="text-green-500" />}
          color="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
          iconBg="bg-green-100"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<CalendarCheck className="text-yellow-500" />}
          color="bg-gradient-to-br from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Activity className="text-purple-500" />}
          color="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === "completed"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("scheduled")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === "scheduled"
                  ? "bg-white text-yellow-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === "in-progress"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              In Progress
            </button>
          </div>

          <div className="relative flex-grow md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by doctor, department..."
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
      </div>

      {/* Records by Month */}
      {Object.keys(groupedRecords).length > 0 ? (
        Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
          <div key={monthYear} className="mb-8">
            <div className="flex items-center mb-4">
              <CalendarDays className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">
                {monthYear}
              </h2>
            </div>

            {/* Records List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="divide-y divide-gray-100">
                {monthRecords.map((record) => (
                  <div
                    key={record._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => handleExpandRecord(record._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-medium text-lg shadow-sm">
                            {record.doctor.split(" ")[0][0]}
                            {record.doctor.split(" ")[1]
                              ? record.doctor.split(" ")[1][0]
                              : ""}
                          </div>
                          <div>
                            <h3 className="text-md font-medium text-gray-800">
                              {record.doctor}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">
                              {record.department || record.specialization}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3 mr-1" />
                                {record.scheduledTime || "N/A"}
                              </div>
                              <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(record.date), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <StatusBadge status={record.status} />
                          <ChevronDown
                            className={`ml-2 w-4 h-4 text-gray-400 transition-transform ${
                              expandedRecord === record._id
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {expandedRecord === record._id && (
                      <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Appointment Details
                            </h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Department
                                  </p>
                                  <p className="text-sm font-medium capitalize">
                                    {record.department}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Reason
                                  </p>
                                  <p className="text-sm font-medium line-clamp-1">
                                    {record.reason || "Not specified"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {record.consultationDetails && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Consultation Information
                              </h4>
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Token Number
                                    </p>
                                    <p className="text-sm font-medium">
                                      {record.consultationDetails.tokenNumber ||
                                        "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Duration
                                    </p>
                                    <p className="text-sm font-medium">
                                      {record.consultationDetails.duration ||
                                        "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {record.diagnosis && (
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Diagnosis & Treatment
                              </h4>
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Diagnosis
                                  </p>
                                  <p className="text-sm">
                                    {record.diagnosis ||
                                      "No diagnosis recorded"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Treatment Plan
                                  </p>
                                  <p className="text-sm">
                                    {record.treatment ||
                                      "No treatment plan recorded"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Prescription Information (if available) */}
                        {record.prescription && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Pill className="w-4 h-4 mr-1 text-blue-500" />
                              Prescription
                            </h4>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="text-sm">
                                {record.prescription}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes Section (if available) */}
                        {record.notes && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Doctor's Notes
                            </h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">
                                {record.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No medical records found
          </h3>
          <p className="text-gray-500 mb-6 text-center">
            {searchQuery
              ? "No results match your search criteria"
              : activeTab !== "all"
              ? `You don't have any ${activeTab} records`
              : "Your medical history will appear here once you've had consultations"}
          </p>
          {(searchQuery || activeTab !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      )}
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
      Loading medical records...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">{error}</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      There was a problem loading your medical records. Please try again.
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

export default MedicalHistory;
