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
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import WithAuthRedirect from "../../components/withAuthRedirect ";

function BookAppointment() {
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    reason: "",
  });
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

  // Handle input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/appointment/create`,
        {
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

      toast.success("Appointment booked successfully");
      setBookingSuccess(true);

      // Reset form after small delay
      setTimeout(() => {
        setFormData({
          department: "",
          doctor: "",
          date: "",
          reason: "",
        });
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return <SuccessState />;
  }

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
          <p className="text-gray-500">Schedule an appointment with a doctor</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Please describe your symptoms or reason for appointment"
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Success state after booking
function SuccessState() {
  return (
    <div className="max-w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Appointment Booked Successfully!
        </h2>
        <p className="text-gray-600 mb-8">
          Your appointment has been scheduled. You can check the details in your
          Queue Status.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/patient/queue-status"
            className="px-6 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <Clock className="w-5 h-5" />
            Check Queue Status
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
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
      <div className="mt-6 text-blue-700 font-medium">Loading...</div>
    </div>
  );
}

export default BookAppointment;
