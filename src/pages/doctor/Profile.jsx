import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  CirclePlus,
  Trash2,
  Save,
  Clock,
  Calendar,
  CalendarDays,
  UserRound,
  GraduationCap,
  Phone,
  BookCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  Lock,
  Eye,
  EyeOff,
  Key,
  Shield,
  RefreshCw,
  Briefcase,
  Award,
  Laptop,
  Globe,
} from "lucide-react";

function DoctorProfile() {
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    qualification: "",
    experience: "",
    contactNumber: "",
    availability: [],
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [originalDoctor, setOriginalDoctor] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [refreshingSession, setRefreshingSession] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/doctor/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        setDoctor(response.data.doctor);
        setOriginalDoctor(JSON.parse(JSON.stringify(response.data.doctor)));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const refreshSessionInfo = async () => {
    setRefreshingSession(true);
    await fetchSessionInfo();
    await fetchSessionHistory();
    setRefreshingSession(false);
  };

  const fetchSessionHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/session-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessionHistory(response.data.sessionHistory || []);
      setHistoryError(null);
    } catch (err) {
      console.error("Error fetching session history:", err);
      setHistoryError(
        err.response?.data?.message || "Failed to fetch session history"
      );
      setSessionHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getSessionDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;

    // Convert to human readable format
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const fetchSessionInfo = async () => {
    try {
      setLoadingSession(true);
      const token = localStorage.getItem("token");
      const sessionToken = localStorage.getItem("sessionToken");

      if (!token || !sessionToken) {
        throw new Error("No active session");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/session-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-token": sessionToken,
          },
        }
      );

      setSessionInfo(response.data.sessionStatus);
      setSessionError(null);
    } catch (err) {
      console.error("Error fetching session info:", err);
      setSessionError(
        err.response?.data?.message || "Failed to fetch session information"
      );
      setSessionInfo(null);
    } finally {
      setLoadingSession(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_URL}/api/user/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Session terminated successfully");
      refreshSessionInfo();
    } catch (err) {
      console.error("Error terminating session:", err);
      toast.error(err.response?.data?.message || "Failed to terminate session");
    }
  };

  useEffect(() => {
    if (activeSection === "sessions") {
      fetchSessionInfo();
      fetchSessionHistory();
    }
  }, [activeSection]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onAvailabilityChange = (index, field, value) => {
    const newAvailability = [...doctor.availability];
    newAvailability[index][field] = value;
    setDoctor({ ...doctor, availability: newAvailability });
  };

  const onAddAvailability = () => {
    const newAvailability = [...doctor.availability];
    newAvailability.push({
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    });
    setDoctor({ ...doctor, availability: newAvailability });
  };

  const onRemoveAvailability = (index) => {
    const newAvailability = [...doctor.availability];
    newAvailability.splice(index, 1);
    setDoctor({ ...doctor, availability: newAvailability });
  };

  const hasChanges = () => {
    return JSON.stringify(doctor) !== JSON.stringify(originalDoctor);
  };

  const saveChanges = async () => {
    try {
      setSaveLoading(true);
      // Validation

      const response = await axios.put(
        `${import.meta.env.VITE_URL}/api/doctor/profile`,
        doctor,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        setOriginalDoctor(JSON.parse(JSON.stringify(doctor)));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  // Password change functionality
  const changePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.currentPassword) {
    }
    try {
      setPasswordSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_URL}/api/user/change-password`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="pb-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400">
            Manage and view your profile information
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={fadeIn}
          className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-6"
        >
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-800">
            <button
              onClick={() => setActiveSection("general")}
              className={`px-4 py-3 whitespace-nowrap font-medium flex items-center ${
                activeSection === "general"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400 hover:bg-[#171B24] hover:text-gray-300"
              }`}
            >
              <UserRound className="w-4 h-4 mr-2" />
              General Information
            </button>
            <button
              onClick={() => setActiveSection("availability")}
              className={`px-4 py-3 whitespace-nowrap font-medium flex items-center ${
                activeSection === "availability"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400 hover:bg-[#171B24] hover:text-gray-300"
              }`}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Availability
            </button>
            <button
              onClick={() => setActiveSection("sessions")}
              className={`px-4 py-3 whitespace-nowrap font-medium flex items-center ${
                activeSection === "sessions"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400 hover:bg-[#171B24] hover:text-gray-300"
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security & Sessions
            </button>
            <button
              onClick={() => setActiveSection("password")}
              className={`px-4 py-3 whitespace-nowrap font-medium flex items-center ${
                activeSection === "password"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400 hover:bg-[#171B24] hover:text-gray-300"
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>

          <div className="p-6">
            {activeSection === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="First Name"
                    name="firstName"
                    value={doctor.firstName || ""}
                    onChange={onChange}
                    placeholder="Your first name"
                    icon={<UserRound className="w-5 h-5 text-blue-400" />}
                  />
                  <ProfileField
                    label="Last Name"
                    name="lastName"
                    value={doctor.lastName || ""}
                    onChange={onChange}
                    placeholder="Your last name"
                    icon={<UserRound className="w-5 h-5 text-blue-400" />}
                  />
                </div>

                <ProfileField
                  label="Specialization"
                  name="specialization"
                  value={doctor.specialization || ""}
                  onChange={onChange}
                  placeholder="Your medical specialization"
                  icon={<Briefcase className="w-5 h-5 text-blue-400" />}
                />

                <ProfileField
                  label="Qualification"
                  name="qualification"
                  value={doctor.qualification || ""}
                  onChange={onChange}
                  placeholder="Your medical qualification"
                  icon={<GraduationCap className="w-5 h-5 text-blue-400" />}
                />

                <ProfileField
                  label="Experience (years)"
                  name="experience"
                  value={doctor.experience || ""}
                  onChange={onChange}
                  placeholder="Years of experience"
                  type="number"
                  icon={<Award className="w-5 h-5 text-blue-400" />}
                />

                <ProfileField
                  label="Contact Number"
                  name="contactNumber"
                  value={doctor.contactNumber || ""}
                  onChange={onChange}
                  placeholder="Your contact number"
                  icon={<Phone className="w-5 h-5 text-blue-400" />}
                />

                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveChanges}
                    disabled={!hasChanges() || saveLoading}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 ${
                      hasChanges() && !saveLoading
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    {saveLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "availability" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">
                    Availability Schedule
                  </h3>
                  <button
                    onClick={onAddAvailability}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium"
                  >
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add Availability
                  </button>
                </div>

                <div className="space-y-4">
                  {doctor.availability && doctor.availability.length > 0 ? (
                    doctor.availability.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-[#171B24] border border-gray-800 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="grid grid-cols-3 gap-4 w-full">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Day
                              </label>
                              <select
                                value={slot.day}
                                onChange={(e) =>
                                  onAvailabilityChange(
                                    index,
                                    "day",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {[
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                  "Sunday",
                                ].map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  onAvailabilityChange(
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  onAvailabilityChange(
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="flex items-end justify-end">
                            <button
                              onClick={() => onRemoveAvailability(index)}
                              className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-[#171B24] rounded-lg border border-dashed border-gray-700">
                      <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 mb-4">No availability set</p>
                      <button
                        onClick={onAddAvailability}
                        className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center mx-auto text-sm font-medium"
                      >
                        <CirclePlus className="w-4 h-4 mr-2" />
                        Add Availability
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveChanges}
                    disabled={!hasChanges() || saveLoading}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 ${
                      hasChanges() && !saveLoading
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    {saveLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "sessions" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Security & Active Sessions
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Manage your current login sessions and security settings
                    </p>
                  </div>
                  <button
                    onClick={refreshSessionInfo}
                    disabled={refreshingSession}
                    className="p-2 rounded-full bg-[#171B24] hover:bg-[#1F242E] text-gray-400 hover:text-blue-400"
                  >
                    <RefreshCw
                      className={`h-5 w-5 ${
                        refreshingSession ? "animate-spin text-blue-400" : ""
                      }`}
                    />
                  </button>
                </div>

                <motion.div variants={fadeIn} className="relative">
                  <div className="absolute bottom-0 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-5 blur-xl"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-400 rounded-full opacity-5 blur-xl"></div>

                  <div className="bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600/10 to-blue-400/10 border-b border-blue-500/20">
                      <h4 className="font-medium text-white flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-blue-400" />
                        Current Active Session
                      </h4>
                    </div>

                    <div className="p-6">
                      {loadingSession ? (
                        <div className="flex justify-center items-center py-8">
                          <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                        </div>
                      ) : sessionError ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-200 mb-2">
                            Session Error
                          </h3>
                          <p className="text-gray-400 text-center max-w-md">
                            {sessionError}
                          </p>
                          <button
                            onClick={refreshSessionInfo}
                            className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center text-sm font-medium"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </button>
                        </div>
                      ) : sessionInfo ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mb-3">
                                <Laptop className="h-7 w-7 text-blue-400" />
                              </div>
                              <div className="mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/30">
                                  <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                  Active Now
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-100 text-lg mb-1">
                                Current Device
                              </h4>
                              <p className="text-sm text-gray-400">
                                {sessionInfo.lastLoginIP || "Unknown device"}
                              </p>
                            </div>

                            <div className="bg-[#171B24] rounded-lg p-4">
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    IP Address
                                  </p>
                                  <p className="text-sm font-medium text-gray-200 bg-[#0D1117] p-2 rounded border border-gray-700">
                                    {sessionInfo.lastLoginIP || "Unknown"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Started At
                                  </p>
                                  <p className="text-sm text-gray-300">
                                    {formatDate(sessionInfo.lastLogin)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Expires At
                                  </p>
                                  <p className="text-sm text-gray-300">
                                    {formatDate(sessionInfo.sessionExpiresAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-800 pt-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  terminateSession(sessionInfo.sessionId)
                                }
                                className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-900/30 flex items-center text-sm font-medium"
                              >
                                <Lock className="h-4 w-4 mr-2" />
                                End This Session
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-600/20 to-yellow-400/20 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-100 mb-2">
                            No active session
                          </h3>
                          <p className="text-gray-400">
                            Your session information is not available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Session History
                    </h3>
                    {loadingHistory && !historyError && (
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                        <span className="text-sm text-gray-400">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-600/5 to-cyan-500/5">
                      <h4 className="font-medium text-gray-100 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-cyan-400" />
                        Recent Login Activity
                      </h4>
                    </div>

                    {historyError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <p className="text-gray-400">{historyError}</p>
                        <button
                          onClick={fetchSessionHistory}
                          className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 flex items-center mx-auto text-sm font-medium"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </button>
                      </div>
                    ) : sessionHistory && sessionHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                          <thead className="bg-[#171B24]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Device
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                IP Address
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Started
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Duration
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {sessionHistory.map((session) => {
                              // Determine device type from user agent
                              let deviceType = "Unknown";
                              if (session.userAgent) {
                                if (session.userAgent.includes("Mobile")) {
                                  deviceType = "Mobile Device";
                                } else if (
                                  session.userAgent.includes("Windows")
                                ) {
                                  deviceType = "Windows PC";
                                } else if (session.userAgent.includes("Mac")) {
                                  deviceType = "Mac";
                                } else if (
                                  session.userAgent.includes("Linux")
                                ) {
                                  deviceType = "Linux";
                                } else if (
                                  session.userAgent.includes("iPhone")
                                ) {
                                  deviceType = "iPhone";
                                } else if (
                                  session.userAgent.includes("Android")
                                ) {
                                  deviceType = "Android";
                                }
                              }

                              return (
                                <tr
                                  key={session._id}
                                  className="hover:bg-[#1A1E26]"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mr-3">
                                        <Globe className="h-4 w-4 text-gray-300" />
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {deviceType}
                                        </div>
                                        <div className="text-xs text-gray-500 max-w-xs truncate">
                                          {session.userAgent}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {session.ipAddress || "Unknown"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {formatDate(session.loginTime)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {getSessionDuration(
                                      session.loginTime,
                                      session.logoutTime || new Date()
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {!session.logoutTime ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/30">
                                        <span className="w-1.5 h-1.5 mr-1 bg-green-500 rounded-full"></span>
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                                        Ended
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">
                          No session history available
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="mt-6 border-t border-gray-800 pt-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-600/10 to-yellow-400/10 text-yellow-400">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">
                        Security Recommendations
                      </h4>
                      <ul className="space-y-2 text-gray-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Always log out from shared devices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>
                            Use a strong, unique password for your account
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>
                            Review your login history regularly for suspicious
                            activity
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeSection === "password" && (
              <div>
                <div className="max-w-md mx-auto">
                  <div className="bg-[#171B24] border border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Change Password
                    </h3>

                    <form onSubmit={changePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Key className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={onPasswordChange}
                            className="pl-10 pr-10 w-full py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={onPasswordChange}
                            className="pl-10 pr-10 w-full py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onPasswordChange}
                            className="pl-10 pr-10 w-full py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center"
                        >
                          {passwordSaving ? (
                            <>
                              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                              Changing...
                            </>
                          ) : (
                            <>Change Password</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="mt-6 bg-[#0D1117]/50 border border-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-200">
                          Password Requirements
                        </h4>
                      </div>
                    </div>
                    <ul className="list-disc text-xs text-gray-400 ml-8 space-y-1">
                      <li>Must be at least 6 characters long</li>
                      <li>Include both uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1E26",
            color: "#fff",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#1A1E26",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#1A1E26",
            },
          },
        }}
      />
    </div>
  );
}

// Form field component
const ProfileField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  isSelect = false,
  options = [],
  ...props
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>

      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="pl-10 w-full px-3 py-2.5 bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#171B24] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-10 w-full px-3 py-2.5 bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          {...props}
        />
      )}
    </div>
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
      Loading your profile...
    </div>
  </div>
);

export default DoctorProfile;
