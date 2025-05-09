import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Calendar,
  User,
  Clock,
  FileText,
  Search,
  Building,
  CheckCircle,
  X,
  ArrowRight,
  Calendar as CalendarIcon,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import WithAuthRedirect from "../../components/withAuthRedirect ";
import { motion } from "framer-motion";

function BookAppointment() {
  // State for patient search
  const [patientId, setPatientId] = useState("");
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientFound, setPatientFound] = useState(null);
  const [patientError, setPatientError] = useState("");

  // State for form data
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    reason: "",
  });

  // Other states
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [departments, setDepartments] = useState([
    { id: "cardiology", name: "Cardiology" },
    { id: "dermatology", name: "Dermatology" },
    { id: "neurology", name: "Neurology" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "psychiatry", name: "Psychiatry" },
    { id: "gynecology", name: "Gynecology" },
    { id: "ophthalmology", name: "Ophthalmology" },
    { id: "dentistry", name: "Dentistry" },
    { id: "general", name: "General" },
  ]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formData.department) return;

      try {
        setFetchingDoctors(true);
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/doctor/get-all-doctors/${
            formData.department
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDoctors(res.data.doctors);
      } catch (error) {
        setDoctors([]);
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors");
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, [formData.department]);

  // Handle patient ID input change
  const handlePatientIdChange = (e) => {
    setPatientId(e.target.value);
    // Clear previous search results when input changes
    if (patientFound) {
      setPatientFound(null);
      setPatientError("");
    }
  };

  // Search for patient by ID
  const searchPatient = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setPatientError("Please enter a patient ID");
      return;
    }

    try {
      setSearchingPatient(true);
      setPatientError("");

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setPatientFound(response.data.patient);
        toast.success("Patient found");
      } else {
        setPatientFound(null);
        setPatientError("No patient found with this ID");
        toast.error("Patient not found");
      }
    } catch (error) {
      setPatientFound(null);
      setPatientError(
        error.response?.data?.message || "Failed to find patient"
      );
      toast.error(
        error.response?.data?.message || "Error searching for patient"
      );
    } finally {
      setSearchingPatient(false);
    }
  };

  // Handle input changes for appointment form
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle appointment form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientFound) {
      toast.error("Please search and select a valid patient first");
      return;
    }

    try {
      setLoading(true);

      // Create appointment for the found patient
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/appointment/create`,
        {
          patientId: patientFound._id,
          doctorId: formData.doctor,
          department: formData.department,
          date: formData.date,
          reason: formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAppointmentDetails(response.data.appointment);
      toast.success("Appointment booked successfully");
      setBookingSuccess(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  // Reset the entire form
  const resetForm = () => {
    setPatientId("");
    setPatientFound(null);
    setPatientError("");
    setFormData({
      department: "",
      doctor: "",
      date: "",
      reason: "",
    });
    setBookingSuccess(false);
    setAppointmentDetails(null);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

          <div>
            <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
            <p className="text-gray-400">
              Schedule an appointment for an existing patient
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#0D1117] rounded-lg border border-gray-800 p-6"
        >
          {/* Patient Search Section */}
          <div className="mb-8 border-b border-gray-800 pb-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Find Patient
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Patient ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientId}
                    onChange={handlePatientIdChange}
                    placeholder="Enter patient ID (e.g. P2303001)"
                    className="w-full px-3 py-2 border outline-none bg-[#171B24] border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={searchPatient}
                  disabled={searchingPatient}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-colors flex items-center shadow-sm"
                >
                  {searchingPatient ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find Patient
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Display patient details when found */}
            {patientFound && (
              <div className="mt-4 bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                <h3 className="font-medium text-blue-300 mb-2 flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Patient Found
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Name:</span>{" "}
                      {patientFound.firstName} {patientFound.lastName}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Patient ID:</span>{" "}
                      {patientFound.patientIdentifier}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Gender:</span>{" "}
                      {patientFound.gender}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Contact:</span>{" "}
                      {patientFound.contactNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {patientError && (
              <div className="mt-4 bg-red-900/20 p-4 rounded-lg border border-red-800/30 text-red-300">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <p>{patientError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Appointment Booking Form - Only shown when patient is found */}
          {patientFound ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                Appointment Details
              </h2>

              {/* Department Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Building className="w-4 h-4 mr-2 text-blue-400" />
                  Department
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={onChange}
                  className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-400" />
                  Doctor
                </label>
                <div className="relative">
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={!formData.department || fetchingDoctors}
                  >
                    <option value="">
                      {fetchingDoctors
                        ? "Loading doctors..."
                        : !formData.department
                        ? "First select a department"
                        : "Select doctor"}
                    </option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {`Dr. ${doc.firstName || doc.name} ${
                          doc.lastName || ""
                        }`}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={onChange}
                  className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Reason */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={onChange}
                  placeholder="Please describe symptoms or reason for appointment"
                  className="w-full px-3 py-3 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="4"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-md ${
                    loading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-t-transparent border-white border-solid rounded-full animate-spin" />
                      <span>Booking Appointment...</span>
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-5 h-5" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p>Please search for a patient first to book an appointment</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default BookAppointment;
