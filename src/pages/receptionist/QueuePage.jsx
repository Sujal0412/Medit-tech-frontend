import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Users,
  Clock,
  UserPlus,
  ChevronLeft,
  PlayCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  User,
  Search,
  X,
  AlertCircle,
  Shield,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  ChevronDown,
  Timer,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function QueuePage() {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchQueueData();
    // Set up auto-refresh every 20 seconds
    const interval = setInterval(fetchQueueData, 20000);
    return () => clearInterval(interval);
  }, [queueId]);

  const fetchQueueData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else if (!refreshing) setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/appointment/queue/${queueId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setQueue(response.data.queue);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch queue details");
      console.error("Error fetching queue details:", err);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchQueueData(true);
  };

  const handleAddToQueue = () => {
    navigate("/reception/add-patient", {
      state: { doctorId: queue?.doctor?.id },
    });
  };

  const handleExpandRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Filter patients based on search query and status filter
  const filteredPatients =
    queue?.patients.filter((patient) => {
      // Apply status filter first
      if (filterStatus !== "all" && patient.status !== filterStatus)
        return false;

      // Then apply search filter if there's search text
      if (!search) return true;

      const patientInfo = patient.patientInfo;
      if (!patientInfo) return false;

      return (
        patientInfo.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
        patientInfo.reason?.toLowerCase().includes(search.toLowerCase()) ||
        patientInfo.department?.toLowerCase().includes(search.toLowerCase()) ||
        patientInfo.email?.toLowerCase().includes(search.toLowerCase())
      );
    }) || [];

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchQueueData} />;
  if (!queue)
    return <ErrorState error="Queue not found" onRetry={fetchQueueData} />;

  // Find current patient
  const currentPatient = queue.patients.find((p) => p.isCurrentPatient);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 relative"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

          <div className="flex items-center">
            <Link
              to="/reception/manage-queue"
              className="mr-3 p-2 rounded-full bg-[#171B24] text-blue-400 hover:bg-[#222A35] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Queue Details</h1>
              <p className="text-gray-400">
                Manage patient queue for {queue.doctor.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
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
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToQueue}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 flex items-center gap-2 shadow-sm transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Add Patient
            </motion.button>
          </div>
        </motion.div>

        {/* Doctor & Queue Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Doctor Information Card */}
          <motion.div
            variants={fadeIn}
            className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden col-span-1"
          >
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <h2 className="text-lg font-semibold text-gray-100 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Doctor Information
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-sm">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-100">
                    {queue.doctor.name}
                  </h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {queue.doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Average Consultation</p>
                  <p className="text-sm font-medium text-gray-200">
                    {queue.doctor.consultationDuration ||
                      queue.stats.averageConsultationTime ||
                      0}{" "}
                    mins
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Current Token</p>
                  <p className="text-sm font-medium bg-blue-900/30 px-2 py-0.5 rounded text-blue-300 border border-blue-800/30">
                    {queue.currentToken || "Not Started"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Queue Statistics Card */}
          <motion.div
            variants={fadeIn}
            className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden col-span-2"
          >
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <h2 className="text-lg font-semibold text-gray-100 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Queue Statistics
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  title="Total Patients"
                  value={queue.stats.totalPatients}
                  icon={<Users className="text-blue-400" />}
                  color="bg-blue-900/20"
                  borderColor="border-blue-800/30"
                  iconBg="bg-blue-900/30"
                />
                <StatCard
                  title="Waiting"
                  value={queue.stats.waitingPatients}
                  icon={<Clock className="text-yellow-400" />}
                  color="bg-yellow-900/20"
                  borderColor="border-yellow-800/30"
                  iconBg="bg-yellow-900/30"
                />
                <StatCard
                  title="In Progress"
                  value={queue.stats.inProgressPatients}
                  icon={<PlayCircle className="text-green-400" />}
                  color="bg-green-900/20"
                  borderColor="border-green-800/30"
                  iconBg="bg-green-900/30"
                />
                <StatCard
                  title="Completed"
                  value={queue.stats.completedPatients}
                  icon={<CheckCircle className="text-purple-400" />}
                  color="bg-purple-900/20"
                  borderColor="border-purple-800/30"
                  iconBg="bg-purple-900/30"
                />
              </div>

              {queue.stats.averageConsultationTime > 0 && (
                <div className="mt-4 bg-blue-900/20 rounded-lg p-3 border border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-400 mr-2" />
                      <p className="text-sm font-medium text-blue-300">
                        Average Consultation Time
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-blue-300">
                      {queue.stats.averageConsultationTime} minutes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Current Patient Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-6"
        >
          <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
            <h2 className="text-lg font-semibold text-gray-100 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-400" />
              Current Patient
            </h2>
          </div>

          <div className="p-4">
            {currentPatient && currentPatient.status !== "completed" ? (
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-lg shadow-sm ">
                      {currentPatient.tokenNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-md font-medium text-gray-100">
                          {currentPatient.patientInfo?.name ||
                            "Unknown Patient"}
                        </h3>
                        <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-2 py-0.5 rounded border border-blue-800/30">
                          Current
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {currentPatient.patientInfo?.email}
                      </p>
                      {currentPatient.patientInfo?.contactNumber && (
                        <p className="text-sm text-gray-400 mt-1 flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {currentPatient.patientInfo.contactNumber}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        <span className="font-medium text-gray-300">
                          Reason:
                        </span>{" "}
                        {currentPatient.patientInfo?.reason || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-green-900/30 text-green-300 text-xs font-medium px-3 py-1 rounded-full border border-green-800/30 animate-pulse">
                      {currentPatient.status}
                    </span>

                    {currentPatient.actualStartTime && (
                      <div className="flex items-center text-xs text-blue-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Started at {currentPatient.actualStartTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#171B24] rounded-lg p-4 border border-gray-800 flex flex-col items-center text-center py-8">
                <Clock className="h-12 w-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-medium text-gray-200 mb-1">
                  No patient currently being seen
                </h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Select a waiting patient from the queue below to start their
                  consultation
                </p>

                {queue.stats.waitingPatients > 0 && (
                  <Link
                    to="#queue-list"
                    className="px-4 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 flex items-center text-sm font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 transform rotate-90" />
                    View Waiting Patients
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 p-4 mb-6"
          id="queue-list"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients by name, token number, or reason..."
                className="w-full pl-10 pr-10 py-2 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center p-1 bg-[#171B24] rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-blue-900/50 text-blue-300"
                    : "text-gray-400 hover:bg-[#1F242E]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("waiting")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "waiting"
                    ? "bg-yellow-900/50 text-yellow-300"
                    : "text-gray-400 hover:bg-[#1F242E]"
                }`}
              >
                Waiting
              </button>
              <button
                onClick={() => setFilterStatus("in-progress")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "in-progress"
                    ? "bg-green-900/50 text-green-300"
                    : "text-gray-400 hover:bg-[#1F242E]"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "completed"
                    ? "bg-purple-900/50 text-purple-300"
                    : "text-gray-400 hover:bg-[#1F242E]"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </motion.div>

        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-6"
        >
          <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between bg-[#0A0C10]">
            <h2 className="text-lg font-semibold text-gray-100 mb-3 sm:mb-0">
              {filteredPatients.length} Patient
              {filteredPatients.length !== 1 ? "s" : ""} in Queue
            </h2>
            <div className="text-sm text-gray-400">
              Last updated: {format(new Date(), "h:mm a")}
            </div>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {filteredPatients.map((patient) => (
                <motion.div
                  key={patient._id}
                  whileHover={{ backgroundColor: "rgba(23, 27, 36, 0.8)" }}
                  className={`transition-colors ${
                    patient.isCurrentPatient ? "bg-blue-900/20" : ""
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleExpandRow(patient._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-white font-medium text-lg shadow-sm ${
                            patient.isCurrentPatient
                              ? "bg-gradient-to-r from-blue-600 to-cyan-500 "
                              : patient.status === "completed"
                              ? "bg-gradient-to-r from-green-600 to-green-500"
                              : patient.status === "waiting"
                              ? "bg-gradient-to-r from-yellow-600 to-amber-500"
                              : "bg-gradient-to-r from-gray-600 to-gray-500"
                          }`}
                        >
                          {patient.tokenNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-md font-medium text-gray-100">
                              {patient.patientInfo?.name || "Unknown Patient"}
                            </h3>
                            {patient.isCurrentPatient && (
                              <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-2 py-0.5 rounded border border-blue-800/30">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {patient.patientInfo?.email}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <div className="flex items-center text-xs text-gray-300 bg-[#171B24] px-2 py-1 rounded-md">
                              <Clock className="h-3 w-3 mr-1" />
                              {patient.patientInfo?.scheduledTime || "No time"}
                            </div>
                            {patient.patientInfo?.department && (
                              <div className="text-xs text-gray-300 bg-[#171B24] px-2 py-1 rounded-md capitalize flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                {patient.patientInfo.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <StatusBadge status={patient.status} />
                        <ChevronDown
                          className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
                            expandedRow === patient._id
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {expandedRow === patient._id && (
                    <div className="px-4 pb-4 pt-1 bg-[#0A0C10] border-t border-gray-800">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Patient Information
                          </h4>
                          <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                            <div className="space-y-2">
                              {patient.patientInfo?.contactNumber && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 text-blue-400 mr-2" />
                                  <p className="text-sm text-gray-300">
                                    {patient.patientInfo.contactNumber}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 text-blue-400 mr-2" />
                                <p className="text-sm text-gray-300">
                                  {patient.patientInfo?.email || "No email"}
                                </p>
                              </div>
                              <div className="flex items-start">
                                <FileText className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                                <p className="text-sm text-gray-300">
                                  <span className="text-gray-400">Reason:</span>{" "}
                                  {patient.patientInfo?.reason ||
                                    "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Queue Information
                          </h4>
                          <div className="bg-[#171B24] p-3 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-400">
                                  Estimated Start
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {patient.estimatedStartTime || "Not set"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">
                                  Estimated End
                                </p>
                                <p className="text-sm font-medium text-gray-300">
                                  {patient.estimatedEndTime || "Not set"}
                                </p>
                              </div>
                              {patient.status === "in-progress" ||
                              patient.status === "completed" ? (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-400">
                                      Started At
                                    </p>
                                    <p className="text-sm font-medium text-green-400">
                                      {patient.actualStartTime ||
                                        "Not recorded"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">
                                      {patient.status === "completed"
                                        ? "Ended At"
                                        : "Duration"}
                                    </p>
                                    <p className="text-sm font-medium text-blue-400">
                                      {patient.status === "completed"
                                        ? patient.actualEndTime ||
                                          "Not recorded"
                                        : patient.actualDuration ||
                                          "In progress"}
                                    </p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-[#0D1117]">
              <Users className="w-16 h-16 text-gray-700 mb-3" />
              <h3 className="text-lg font-medium text-gray-200 mb-1">
                No patients found
              </h3>
              <p className="text-gray-400 mb-6 text-center">
                {search
                  ? "No results match your search criteria"
                  : filterStatus !== "all"
                  ? `There are no patients with status "${filterStatus}"`
                  : "There are no patients in this queue"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToQueue}
                className="px-4 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 flex items-center text-sm font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Patient
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/30";
      case "in-progress":
        return "bg-green-900/30 text-green-300 border border-green-800/30 animate-pulse";
      case "completed":
        return "bg-blue-900/30 text-blue-300 border border-blue-800/30";
      case "cancelled":
        return "bg-red-900/30 text-red-300 border border-red-800/30";
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

const StatCard = ({
  title,
  value,
  icon,
  color,
  textColor,
  borderColor,
  iconBg,
}) => (
  <div
    className={`${color} rounded-lg p-3 border ${borderColor} flex items-center justify-between transition-shadow hover:shadow-glow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <p className="text-lg font-semibold text-gray-100">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
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
      Loading queue details...
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0C10]">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-100 mb-2">{error}</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      There was a problem loading the queue details. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

export default QueuePage;
