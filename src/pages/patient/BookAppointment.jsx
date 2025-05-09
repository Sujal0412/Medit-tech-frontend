import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function BookAppointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    reason: "",
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  useEffect(() => {
    if (formData.department) {
      fetchDoctors();
    }
  }, [formData.department]);

  const fetchDoctors = async () => {
    try {
      setFetchingDoctors(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/doctor/get-all-doctors/${
          formData.department
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors for this department");
      setDoctors([]);
    } finally {
      setFetchingDoctors(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  if (success) {
    return <SuccessState />;
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">
            Book Appointment
          </h1>
          <p className="text-gray-400">Schedule an appointment with a doctor</p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={fadeIn} className="lg:col-span-3">
          <div className="bg-[#0D1117] rounded-lg border border-gray-800 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Building className="w-4 h-4 mr-2 text-blue-400" />
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={onChange}
                  className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option
                      key={dept.id}
                      value={dept.id}
                      className="bg-[#171B24] text-white"
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

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
                    className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={!formData.department || fetchingDoctors}
                  >
                    <option value="" className="bg-[#171B24] text-white">
                      {fetchingDoctors
                        ? "Loading doctors..."
                        : !formData.department
                        ? "First select a department"
                        : "Select doctor"}
                    </option>
                    {doctors.map((doc) => (
                      <option
                        key={doc._id}
                        value={doc._id}
                        className="bg-[#171B24] text-white"
                      >
                        {`Dr. ${doc.firstName || doc.name} ${
                          doc.lastName || ""
                        }`}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

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
                  className="w-full px-3 py-2.5 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={onChange}
                  placeholder="Please describe your symptoms or reason for appointment"
                  className="w-full px-3 py-3 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="4"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
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
                      <Calendar className="w-5 h-5" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Success state after booking
function SuccessState() {
  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100 flex items-center justify-center">
      <div className="bg-[#0D1117] rounded-xl p-[1px] bg-gradient-to-r from-blue-500 to-cyan-400 max-w-2xl w-full mx-4">
        <div className="bg-[#0D1117] rounded-xl p-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-3">
              Appointment Booked Successfully!
            </h2>
            <p className="text-gray-400 mb-8">
              Your appointment has been scheduled. You can check the details in
              your Queue Status.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/patient/queue-status"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 group"
            >
              Check Queue Status
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-sm text-gray-500"
          >
            You will receive a confirmation shortly
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
