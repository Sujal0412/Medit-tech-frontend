import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaUserCheck,
  FaIdCard,
  FaHospital,
  FaNotesMedical,
  FaUserMd,
  FaAddressCard,
  FaCheckCircle,
  FaPrint,
  FaClipboard,
} from "react-icons/fa";
import { motion } from "framer-motion";

function AddPatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdPatient, setCreatedPatient] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (emergency contact & medical info)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle regular fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create payload
      const patientData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
      };

      // Make API call to create patient
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/create-patient`,
        patientData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle success
      if (response.data.success) {
        // Store created patient data for success screen
        setCreatedPatient({
          patient: response.data.patient,
          tempPassword: response.data.tempPassword || formData.password,
          email: formData.email,
        });

        // Show success screen
        setShowSuccess(true);
        toast.success("Patient successfully registered!");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error(
        error.response?.data?.message || "Failed to register patient"
      );
    } finally {
      setLoading(false);
      // Don't call handleAddAnother here, we want to show the success modal first
    }
  };

  // Reset form and go back to add another patient
  const handleAddAnother = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNumber: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      emergencyContact: {
        name: "",
        relationship: "",
        contactNumber: "",
      },
    });
    setCreatedPatient(null);
    setShowSuccess(false);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Show patient details modal if patient was created
  if (showSuccess && createdPatient) {
    return (
      <div className="min-h-screen bg-[#0A0C10] py-6 px-4 sm:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full"
        >
          <div className="bg-[#0D1117] rounded-xl shadow-lg overflow-hidden border border-gray-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600/80 to-blue-500/80 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-md">
                  <FaCheckCircle className="text-blue-600 h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Patient Registered Successfully
                  </h2>
                  <p className="opacity-90">Patient record has been created</p>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="p-6">
              {/* Patient Personal Information */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-100 flex items-center">
                    <FaIdCard className="mr-2 text-blue-400" />
                    Patient Information
                  </h3>
                </div>

                <div className="bg-[#171B24] rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Full Name</p>
                      <p className="font-medium text-lg text-gray-200">
                        {createdPatient.patient.firstName}{" "}
                        {createdPatient.patient.lastName}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 mb-1">Patient ID</p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              createdPatient.patient.patientIdentifier
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                          <FaClipboard className="mr-1" />
                          Copy
                        </button>
                      </div>
                      <p className="font-mono text-base bg-blue-900/20 inline-block px-2 py-1 rounded border border-blue-800/30 text-blue-300">
                        {createdPatient.patient.patientIdentifier ||
                          "P2303-00001"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Date of Birth
                      </p>
                      <p className="font-medium text-gray-200">
                        {new Date(
                          createdPatient.patient.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Gender</p>
                      <p className="font-medium capitalize text-gray-200">
                        {createdPatient.patient.gender}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 mb-1">
                          Contact Number
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              createdPatient.patient.contactNumber
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                          <FaClipboard className="mr-1" />
                          Copy
                        </button>
                      </div>
                      <p className="font-medium text-gray-200">
                        {createdPatient.patient.contactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Registration Date
                      </p>
                      <p className="font-medium text-gray-200">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  {createdPatient.patient.address && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <p className="text-sm text-gray-400 mb-1">Address</p>
                      <p className="font-medium text-gray-200">
                        {createdPatient.patient.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information (if created) */}
              {createdPatient.email && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-400" />
                    Account Credentials
                  </h3>
                  <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-800/30">
                    <div className="flex items-center text-yellow-300 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        Please note down these credentials
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#171B24] p-3 rounded border border-yellow-800/30">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Email Address
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(createdPatient.email)
                            }
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                          >
                            <FaClipboard className="mr-1" />
                            Copy
                          </button>
                        </div>
                        <p className="font-medium break-all text-gray-200">
                          {createdPatient.email}
                        </p>
                      </div>
                      <div className="bg-[#171B24] p-3 rounded border border-yellow-800/30">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Password
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(createdPatient.tempPassword)
                            }
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                          >
                            <FaClipboard className="mr-1" />
                            Copy
                          </button>
                        </div>
                        <p className="font-medium font-mono tracking-wide text-gray-200">
                          {createdPatient.tempPassword}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contact (if provided) */}
              {createdPatient.patient.emergencyContact &&
                createdPatient.patient.emergencyContact.name && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center">
                      <FaHospital className="mr-2 text-blue-400" />
                      Emergency Contact
                    </h3>
                    <div className="bg-[#171B24] rounded-lg p-4 border border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            Contact Name
                          </p>
                          <p className="font-medium text-gray-200">
                            {createdPatient.patient.emergencyContact.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            Relationship
                          </p>
                          <p className="font-medium text-gray-200">
                            {createdPatient.patient.emergencyContact
                              .relationship || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            Contact Number
                          </p>
                          <p className="font-medium text-gray-200">
                            {createdPatient.patient.emergencyContact
                              .contactNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAnother}
                  className="px-4 py-2 bg-blue-900/20 text-blue-400 border border-blue-800/30 rounded-lg hover:bg-blue-900/30 transition-colors"
                >
                  Register Another Patient
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white mb-1">
              Register New Patient
            </h1>
            <p className="text-gray-400">
              Create a new patient record and optionally set up their patient
              portal account
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-[#0D1117] rounded-xl shadow-lg overflow-hidden border border-gray-800"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="bg-blue-900/30 p-2 rounded-full">
                <FaUserMd className="text-blue-400 w-5 h-5" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-blue-300">
                Patient Registration Form
              </h2>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center mb-1">
                    <FaUser className="text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      <FaPhone className="text-blue-400 mr-1.5 w-3.5 h-3.5" />
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      <FaCalendar className="text-blue-400 mr-1.5 w-3.5 h-3.5" />
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      max={new Date().toISOString().split("T")[0]}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender*
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "other"].map((option) => (
                        <div
                          key={option}
                          onClick={() =>
                            setFormData({ ...formData, gender: option })
                          }
                          className={`
                            flex items-center justify-center px-3 py-2.5 rounded-lg cursor-pointer
                            ${
                              formData.gender === option
                                ? "bg-blue-900/30 border border-blue-700 text-blue-400 font-medium"
                                : "bg-[#171B24] border border-gray-700 text-gray-300 hover:bg-[#1E2433]"
                            }
                          `}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      <FaAddressCard className="text-blue-400 mr-1.5 w-3.5 h-3.5" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Account Creation */}
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
                  <div className="flex items-start mb-3">
                    <div className="ml-3">
                      <label
                        htmlFor="createAccount"
                        className="font-medium text-blue-300"
                      >
                        Create Patient Portal Account
                      </label>
                      <p className="text-sm text-blue-400">
                        Generate login credentials for the patient
                      </p>
                    </div>
                  </div>

                  <div className="pl-7">
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      <FaEnvelope className="text-blue-400 mr-1.5 w-3.5 h-3.5" />
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="patient@example.com"
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                    <label className="flex items-center mt-2 text-sm font-medium text-gray-300 mb-1">
                      Password*
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="**********"
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Emergency Contact */}
                <div className="space-y-4">
                  <div className="flex items-center mb-1">
                    <FaHospital className="text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Emergency Contact
                    </h3>
                  </div>
                  <div className="bg-[#171B24] p-4 rounded-lg border border-gray-700 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleChange}
                        className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        placeholder="e.g. Spouse, Parent, Child"
                        className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.contactNumber"
                        value={formData.emergencyContact.contactNumber}
                        onChange={handleChange}
                        className="w-full bg-[#0D1117] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 border-t border-gray-700 pt-6 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg transition-all shadow-sm flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <FaUserCheck className="mr-2" />
                    Register Patient
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default AddPatient;
