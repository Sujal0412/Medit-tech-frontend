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
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import WithAuthRedirect from "../../components/withAuthRedirect ";
import { motion } from "framer-motion";

function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

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
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between relative">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FileText className="h-7 w-7 mr-3 text-blue-400" />
              Medical History
            </h1>
            <p className="text-gray-400">
              View your past consultations and medical records
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={fadeIn}>
          <StatCard
            title="Total Records"
            value={stats.total}
            icon={<Layers className="text-blue-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-blue-500/30"
            iconBg="bg-blue-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle className="text-green-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-green-500/30"
            iconBg="bg-green-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="Scheduled"
            value={stats.scheduled}
            icon={<CalendarCheck className="text-yellow-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-yellow-500/30"
            iconBg="bg-yellow-600/20"
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Activity className="text-cyan-400" />}
            color="bg-[#0D1117]"
            borderColor="border-gray-800 hover:border-cyan-500/30"
            iconBg="bg-cyan-600/20"
          />
        </motion.div>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#0D1117] rounded-lg border border-gray-800 p-4 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-[#171B24] rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white"
                  : "text-gray-400 hover:bg-[#1F242E]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "completed"
                  ? "bg-gradient-to-r from-green-600/80 to-green-500/80 text-white"
                  : "text-gray-400 hover:bg-[#1F242E]"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("scheduled")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "scheduled"
                  ? "bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 text-white"
                  : "text-gray-400 hover:bg-[#1F242E]"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "in-progress"
                  ? "bg-gradient-to-r from-cyan-600/80 to-cyan-500/80 text-white"
                  : "text-gray-400 hover:bg-[#1F242E]"
              }`}
            >
              In Progress
            </button>
          </div>

          <div className="relative flex-grow md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by doctor, department..."
              className="w-full pl-10 pr-10 py-2 outline-none bg-[#171B24] border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </motion.div>

      {/* Records by Month */}
      {Object.keys(groupedRecords).length > 0 ? (
        Object.entries(groupedRecords).map(
          ([monthYear, monthRecords], index) => (
            <motion.div
              key={monthYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="mb-8"
            >
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mr-3">
                  <CalendarDays className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-200">
                  {monthYear}
                </h2>
              </div>

              {/* Records List */}
              <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-6">
                <div className="divide-y divide-gray-800">
                  {monthRecords.map((record) => (
                    <motion.div
                      key={record._id}
                      whileHover={{ backgroundColor: "rgba(23, 27, 36, 0.8)" }}
                      className="transition-colors"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => handleExpandRecord(record._id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/60 to-cyan-500/60 text-white font-medium text-lg shadow-sm">
                              {record.doctor.split(" ")[0][0]}
                              {record.doctor.split(" ")[1]
                                ? record.doctor.split(" ")[1][0]
                                : ""}
                            </div>
                            <div>
                              <h3 className="text-md font-medium text-gray-200">
                                {record.doctor}
                              </h3>
                              <p className="text-sm text-gray-400 capitalize">
                                {record.department || record.specialization}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <div className="flex items-center text-xs text-gray-300 bg-[#171B24] px-2 py-1 rounded-md">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {record.scheduledTime || "N/A"}
                                </div>
                                <div className="flex items-center text-xs text-gray-300 bg-[#171B24] px-2 py-1 rounded-md">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(record.date), "MMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <StatusBadge status={record.status} />
                            <ChevronDown
                              className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
                                expandedRecord === record._id
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {expandedRecord === record._id && (
                        <div className="px-4 pb-6 pt-2 bg-[#0D1117]/70 border-t border-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-1.5 text-blue-400" />
                                Appointment Details
                              </h4>
                              <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Department
                                    </p>
                                    <p className="text-sm font-medium text-gray-300 capitalize">
                                      {record.department}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Reason
                                    </p>
                                    <p className="text-sm font-medium text-gray-300 line-clamp-1">
                                      {record.reason || "Not specified"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {record.consultationDetails && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                  <User className="w-4 h-4 mr-1.5 text-cyan-400" />
                                  Consultation Information
                                </h4>
                                <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Token Number
                                      </p>
                                      <p className="text-sm font-medium text-gray-300">
                                        {record.consultationDetails
                                          .tokenNumber || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Duration
                                      </p>
                                      <p className="text-sm font-medium text-gray-300">
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
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                  <Activity className="w-4 h-4 mr-1.5 text-blue-400" />
                                  Diagnosis & Treatment
                                </h4>
                                <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Diagnosis
                                    </p>
                                    <p className="text-sm text-gray-300">
                                      {record.diagnosis ||
                                        "No diagnosis recorded"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Treatment Plan
                                    </p>
                                    <p className="text-sm text-gray-300">
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
                              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <Pill className="w-4 h-4 mr-1.5 text-cyan-400" />
                                Prescription
                              </h4>
                              <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-800/30">
                                <div className="text-sm text-cyan-300">
                                  {record.prescription}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Notes Section (if available) */}
                          {record.notes && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-1.5 text-blue-400" />
                                Doctor's Notes
                              </h4>
                              <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-300">
                                  {record.notes}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-12 bg-[#0D1117] rounded-lg border border-gray-800"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-600/30 flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            No medical records found
          </h3>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            {searchQuery
              ? "No results match your search criteria"
              : activeTab !== "all"
              ? `You don't have any ${activeTab} records`
              : "Your medical history will appear here once you've had consultations"}
          </p>
          {(searchQuery || activeTab !== "all") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-400 rounded-lg border border-blue-800/30 hover:bg-blue-600/30 flex items-center text-sm font-medium"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </motion.button>
          )}
        </motion.div>
      )}
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
      Loading medical records...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-800/30 to-red-600/30 flex items-center justify-center mb-6">
      <AlertCircle className="h-10 w-10 text-red-500" />
    </div>
    <h3 className="text-xl font-medium text-gray-100 mb-2">{error}</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      There was a problem loading your medical records. Please try again.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRetry}
      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Try Again
    </motion.button>
  </div>
);

const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300`}
  >
    <div>
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <p className="text-xl font-bold mt-1 text-gray-100">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/30";
      case "in-progress":
        return "bg-cyan-900/30 text-cyan-300 border border-cyan-800/30 animate-pulse";
      case "completed":
        return "bg-green-900/30 text-green-300 border border-green-800/30";
      case "cancelled":
        return "bg-red-900/30 text-red-300 border border-red-800/30";
      default:
        return "bg-gray-800 text-gray-300 border border-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default WithAuthRedirect(MedicalHistory);
