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

  // Show success state if appointment was booked

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
          <p className="text-gray-500">
            Schedule an appointment for an existing patient
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Patient Search Section */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Find Patient
              </h2>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientId}
                      onChange={handlePatientIdChange}
                      placeholder="Enter patient ID (e.g. P2303001)"
                      className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={searchPatient}
                    disabled={searchingPatient}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
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
                  </button>
                </div>
              </div>

              {/* Display patient details when found */}
              {patientFound && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Patient Found
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {patientFound.firstName} {patientFound.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Patient ID:</span>{" "}
                        {patientFound.patientIdentifier}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Gender:</span>{" "}
                        {patientFound.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Contact:</span>{" "}
                        {patientFound.contactNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Booking Form - Only shown when patient is found */}
            {patientFound ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Appointment Details
                </h2>

                {/* Department Selection */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 mr-2 text-blue-500" />
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 outline-none bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Doctor
                  </label>
                  <div className="relative">
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={onChange}
                      className="w-full px-3 py-2.5 outline-none bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 outline-none bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    Reason for Visit
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={onChange}
                    placeholder="Please describe symptoms or reason for appointment"
                    className="w-full px-3 py-3 outline-none bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
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
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Please search for a patient first to book an appointment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
