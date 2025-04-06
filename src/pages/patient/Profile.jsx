import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  Home,
  Calendar,
  UserCircle,
  RefreshCw,
  Save,
  AlertCircle,
  Heart,
  UserPlus,
  Shield,
  ChevronRight,
  AlertTriangle,
  X,
  GraduationCap,
  UserRound,
  CalendarDays,
  CirclePlus,
  Trash2,
  BookCheck,
  DropletIcon,
  BookOpen,
  HeartPulse,
  BadgeAlert,
  Lock,
  Eye,
  EyeOff,
  Key,
  Clock,
} from "lucide-react";
import withAuthRedirect from "../../components/withAuthRedirect ";

function Profile() {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    medicalHistory: [],
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
    patientIdentifier: "", // Add patientIdentifier to state
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalPatient, setOriginalPatient] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/patient/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      const data = response.data.patient;

      const patientData = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        contactNumber: data.contactNumber || "",
        address: data.address || "",
        bloodGroup: data.bloodGroup || "",
        allergies: data.allergies || "",
        chronicConditions: data.chronicConditions || "",
        emergencyContact: {
          name: data.emergencyContact?.name || "",
          relationship: data.emergencyContact?.relationship || "",
          contactNumber: data.emergencyContact?.contactNumber || "",
        },
        patientIdentifier: data.patientIdentifier || "", // Set patientIdentifier
      };

      setPatient(patientData);
      setOriginalPatient({ ...patientData });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/session-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-session-token": localStorage.getItem("sessionToken"),
          },
        }
      );

      setSessionHistory(response.data.sessionHistory || []);
    } catch (error) {
      setHistoryError(
        error.response?.data?.message || "Failed to load session history"
      );
      toast.error("Failed to load session history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  const getSessionDuration = (startTime, endTime) => {
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hours, ${minutes} minutes`;
  };

  // Add handleLogout function

  const fetchSessionInfo = async () => {
    try {
      setLoadingSession(true);
      setSessionError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/session-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-session-token": localStorage.getItem("sessionToken"),
          },
        }
      );

      setSessionInfo(response.data.sessionStatus);
    } catch (error) {
      setSessionError(
        error.response?.data?.message || "Failed to load session information"
      );
      toast.error("Failed to load session information");
    } finally {
      setLoadingSession(false);
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
    setPatient({
      ...patient,
      [name]: value,
    });
  };

  const onEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      emergencyContact: {
        ...patient.emergencyContact,
        [name]: value,
      },
    });
  };

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const hasChanges = () => {
    return JSON.stringify(patient) !== JSON.stringify(originalPatient);
  };

  const discardChanges = () => {
    setPatient({ ...originalPatient });
    toast("Changes discarded", { icon: "🔄" });
  };

  const saveChanges = async () => {
    if (!hasChanges()) {
      toast.error("No changes detected");
      return;
    }
    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_URL}/api/patient/profile`,
        patient,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      const data = response.data.patient;

      const patientData = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        contactNumber: data.contactNumber || "",
        address: data.address || "",
        bloodGroup: data.bloodGroup || "",
        allergies: data.allergies || "",
        chronicConditions: data.chronicConditions || "",
        emergencyContact: {
          name: data.emergencyContact?.name || "",
          relationship: data.emergencyContact?.relationship || "",
          contactNumber: data.emergencyContact?.contactNumber || "",
        },
        patientIdentifier: data.patientIdentifier || "", // Set patientIdentifier
      };

      setPatient(patientData);
      setOriginalPatient({ ...patientData });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordSaving(true);
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/change-password`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Password updated successfully");
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
    <div className="h-full w-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500">Manage and view your profile</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-700/20 overflow-x-auto">
            <button
              onClick={() => setActiveSection("general")}
              className={`px-4 py-3 font-medium flex items-center ${
                activeSection === "general"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserRound className="w-4 h-4 mr-2" />
              General Information
            </button>

            <button
              onClick={() => setActiveSection("emergency")}
              className={`px-4 py-3 font-medium flex items-center ${
                activeSection === "emergency"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Contact
            </button>

            <button
              onClick={() => setActiveSection("sessions")}
              className={`px-4 py-3 font-medium flex items-center ${
                activeSection === "sessions"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security & Sessions
            </button>

            <button
              onClick={() => setActiveSection("password")}
              className={`px-4 py-3 font-medium flex items-center ${
                activeSection === "password"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
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
                  {/* Add Patient ID field */}
                  <ProfileField
                    label="Patient ID"
                    name="patientIdentifier"
                    value={patient.patientIdentifier}
                    onChange={() => {}} // Make it read-only
                    placeholder="Patient ID"
                    icon={<UserCircle className="w-5 h-5 text-blue-500" />}
                    readOnly
                  />
                  <ProfileField
                    label="First Name"
                    name="firstName"
                    value={patient.firstName}
                    onChange={onChange}
                    placeholder="Your first name"
                    icon={<UserRound className="w-5 h-5 text-blue-500" />}
                  />
                  <ProfileField
                    label="Last Name"
                    name="lastName"
                    value={patient.lastName}
                    onChange={onChange}
                    placeholder="Your last name"
                    icon={<UserRound className="w-5 h-5 text-blue-500" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={patient.dateOfBirth}
                    onChange={onChange}
                    type="date"
                    icon={<CalendarDays className="w-5 h-5 text-blue-500" />}
                  />
                  <ProfileField
                    label="Gender"
                    name="gender"
                    value={patient.gender}
                    onChange={onChange}
                    isSelect={true}
                    options={[
                      { value: "", label: "Select gender" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                    icon={<UserCircle className="w-5 h-5 text-blue-500" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Contact Number"
                    name="contactNumber"
                    value={patient.contactNumber}
                    onChange={onChange}
                    type="tel"
                    maxLength="10"
                    placeholder="Your 10-digit contact number"
                    icon={<Phone className="w-5 h-5 text-blue-500" />}
                  />
                  <ProfileField
                    label="Address"
                    name="address"
                    value={patient.address}
                    onChange={onChange}
                    placeholder="Your address"
                    icon={<Home className="w-5 h-5 text-blue-500" />}
                  />
                </div>
              </div>
            )}

            {activeSection === "sessions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-500" />
                      Active Session Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Details about your current login session
                    </p>
                  </div>
                  <button
                    onClick={fetchSessionInfo}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-1 ${
                        loadingSession ? "animate-spin" : ""
                      }`}
                    />
                    <span className="text-sm">Refresh</span>
                  </button>
                </div>

                {loadingSession ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 border-solid rounded-full animate-spin" />
                    <span className="ml-3 text-blue-600">
                      Loading session information...
                    </span>
                  </div>
                ) : sessionError ? (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <span>{sessionError}</span>
                    </div>
                  </div>
                ) : sessionInfo ? (
                  <div className="space-y-4">
                    {/* Current Session Card */}
                    <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800">
                              Current Session
                            </h3>
                            <p className="text-xs text-blue-600">
                              {sessionInfo.lastLoginIP &&
                                `IP: ${sessionInfo.lastLoginIP}`}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Login Time
                            </p>
                            <p className="mt-1 text-sm text-gray-800">
                              {sessionInfo.lastLogin
                                ? new Date(
                                    sessionInfo.lastLogin
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Session Expires
                            </p>
                            <p className="mt-1 text-sm text-gray-800">
                              {sessionInfo.sessionExpiresAt
                                ? new Date(
                                    sessionInfo.sessionExpiresAt
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              IP Address
                            </p>
                            <p className="mt-1 text-sm text-gray-800">
                              {sessionInfo.lastLoginIP || "Unknown"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Session Duration
                            </p>
                            <p className="mt-1 text-sm text-gray-800">
                              {sessionInfo.lastLogin &&
                              sessionInfo.sessionExpiresAt
                                ? getSessionDuration(
                                    new Date(sessionInfo.lastLogin),
                                    new Date(sessionInfo.sessionExpiresAt)
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-500" />
                          Session History
                        </h3>
                      </div>

                      {loadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 border-solid rounded-full animate-spin" />
                          <span className="ml-3 text-blue-600">
                            Loading session history...
                          </span>
                        </div>
                      ) : historyError ? (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <span>{historyError}</span>
                          </div>
                        </div>
                      ) : sessionHistory.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                          <Clock className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                          <p>No session history available</p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Login Time
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Logout Time
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    IP Address
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Device Info
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Duration
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {sessionHistory
                                  .slice()
                                  .reverse()
                                  .map((session, index) => (
                                    <tr
                                      key={index}
                                      className={
                                        session.logoutTime
                                          ? "bg-white"
                                          : "bg-green-50"
                                      }
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(session.loginTime)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {session.logoutTime ? (
                                          formatDate(session.logoutTime)
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active Session
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {session.ipAddress || "Unknown"}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="truncate max-w-xs">
                                          {session.userAgent || "Unknown"}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {session.loginTime &&
                                        (session.logoutTime || new Date())
                                          ? getSessionDuration(
                                              new Date(session.loginTime),
                                              new Date(
                                                session.logoutTime || new Date()
                                              )
                                            )
                                          : "N/A"}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          {sessionHistory.length > 5 && (
                            <div className="px-6 py-3 bg-gray-50 text-center">
                              <p className="text-sm text-gray-500">
                                Showing recent {sessionHistory.length} login
                                sessions
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Security Tips Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Session Security Tips
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Always log out when using shared devices</li>
                              <li>
                                Your session will automatically expire after 24
                                hours
                              </li>
                              <li>
                                If you notice suspicious activity, change your
                                password immediately
                              </li>
                              <li>
                                Only one active session is allowed at a time for
                                security
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    <Shield className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p>No session information available</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === "emergency" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      Emergency Contact
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Person to contact in case of an emergency
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                      <BadgeAlert className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-gray-800">
                      Emergency Contact Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      label="Contact Name"
                      name="name"
                      value={patient.emergencyContact.name}
                      onChange={onEmergencyContactChange}
                      placeholder="Full name of emergency contact"
                      icon={<UserPlus className="w-5 h-5 text-blue-500" />}
                    />
                    <ProfileField
                      label="Relationship"
                      name="relationship"
                      value={patient.emergencyContact.relationship}
                      onChange={onEmergencyContactChange}
                      placeholder="Relationship to you"
                      icon={<Shield className="w-5 h-5 text-blue-500" />}
                    />
                  </div>

                  <div className="mt-4">
                    <ProfileField
                      label="Contact Number"
                      name="contactNumber"
                      value={patient.emergencyContact.contactNumber}
                      onChange={onEmergencyContactChange}
                      type="tel"
                      maxLength="10"
                      placeholder="10-digit contact number"
                      icon={<Phone className="w-5 h-5 text-blue-500" />}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-blue-500" />
                      Change Password
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Update your account password
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <form onSubmit={changePassword} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Key className="w-5 h-5 text-blue-500" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={onPasswordChange}
                          placeholder="Enter your current password"
                          className="pl-10 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-blue-500" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={onPasswordChange}
                          placeholder="Enter your new password"
                          className="pl-10 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-blue-500" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={onPasswordChange}
                          placeholder="Confirm your new password"
                          className="pl-10 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordData.newPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <div className="flex items-center text-red-600 bg-red-50 p-2 rounded-md text-sm">
                          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                          Passwords don't match
                        </div>
                      )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={
                          passwordSaving ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                        }
                        className={`w-full px-4 py-2 rounded-lg transition-all flex items-center justify-center ${
                          passwordSaving ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                        }`}
                      >
                        {passwordSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-t-transparent border-white border-solid rounded-full animate-spin mr-2" />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Password Security Tips
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Use a combination of letters, numbers, and symbols
                          </li>
                          <li>Avoid using easily guessable information</li>
                          <li>Use a different password than other accounts</li>
                          <li>Consider using a password manager</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Changes Button - only show for general and emergency tabs */}
            {(activeSection === "general" || activeSection === "emergency") && (
              <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
                {hasChanges() && (
                  <button
                    onClick={discardChanges}
                    className="px-4 py-2 mr-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Discard
                  </button>
                )}

                <button
                  onClick={saveChanges}
                  disabled={!hasChanges() || saving}
                  className={`px-6 py-2.5 rounded-lg transition-all flex items-center justify-center ${
                    !hasChanges()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-t-transparent border-white border-solid rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
    <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="pl-10 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
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
          className="pl-10 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          {...props}
        />
      )}
    </div>
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
    <div className="mt-6 text-blue-700 font-medium">
      Loading your profile...
    </div>
  </div>
);

export default Profile;
