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

  // Show patient details modal if patient was created
  if (showSuccess && createdPatient) {
    return (
      <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
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
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaIdCard className="mr-2 text-blue-500" />
                    Patient Information
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-lg">
                        {createdPatient.patient.firstName}{" "}
                        {createdPatient.patient.lastName}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 mb-1">Patient ID</p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              createdPatient.patient.patientIdentifier
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <FaClipboard className="mr-1" />
                          Copy
                        </button>
                      </div>
                      <p className="font-mono text-base bg-blue-50 inline-block px-2 py-1 rounded border border-blue-100">
                        {createdPatient.patient.patientIdentifier ||
                          "P2303-00001"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {new Date(
                          createdPatient.patient.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="font-medium capitalize">
                        {createdPatient.patient.gender}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 mb-1">
                          Contact Number
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              createdPatient.patient.contactNumber
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <FaClipboard className="mr-1" />
                          Copy
                        </button>
                      </div>
                      <p className="font-medium">
                        {createdPatient.patient.contactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Registration Date
                      </p>
                      <p className="font-medium">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  {createdPatient.patient.address && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-medium">
                        {createdPatient.patient.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information (if created) */}
              {createdPatient.email && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Account Credentials
                  </h3>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center text-yellow-800 mb-3">
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
                      <div className="bg-white p-3 rounded border border-yellow-100">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">
                            Email Address
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(createdPatient.email)
                            }
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                          >
                            <FaClipboard className="mr-1" />
                            Copy
                          </button>
                        </div>
                        <p className="font-medium break-all">
                          {createdPatient.email}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-yellow-100">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">
                            Password
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(createdPatient.tempPassword)
                            }
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                          >
                            <FaClipboard className="mr-1" />
                            Copy
                          </button>
                        </div>
                        <p className="font-medium font-mono tracking-wide">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <FaHospital className="mr-2 text-blue-500" />
                      Emergency Contact
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Contact Name
                          </p>
                          <p className="font-medium">
                            {createdPatient.patient.emergencyContact.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Relationship
                          </p>
                          <p className="font-medium">
                            {createdPatient.patient.emergencyContact
                              .relationship || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Contact Number
                          </p>
                          <p className="font-medium">
                            {createdPatient.patient.emergencyContact
                              .contactNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // The rest of your component (form) remains unchanged
  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Existing form code */}
      <div className=" mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Register New Patient
          </h1>
          <p className="text-gray-500">
            Create a new patient record and optionally set up their patient
            portal account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaUserMd className="text-blue-600 w-5 h-5" />
              </div>
              <h2 className="ml-3 text-lg font-medium text-blue-800">
                Patient Registration Form
              </h2>
            </div>
          </div>

          {/* Form body remains unchanged */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center mb-1">
                    <FaUser className="text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="text-blue-500 mr-1.5 w-3.5 h-3.5" />
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaCalendar className="text-blue-500 mr-1.5 w-3.5 h-3.5" />
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      max={new Date().toISOString().split("T")[0]}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                ? "bg-blue-50 border-2 border-blue-500 text-blue-700 font-medium"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaAddressCard className="text-blue-500 mr-1.5 w-3.5 h-3.5" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Account Creation */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="ml-3">
                      <label
                        htmlFor="createAccount"
                        className="font-medium text-blue-800"
                      >
                        Create Patient Portal Account
                      </label>
                      <p className="text-sm text-blue-600">
                        Generate login credentials for the patient
                      </p>
                    </div>
                  </div>

                  <div className="pl-7">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="text-blue-500 mr-1.5 w-3.5 h-3.5" />
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="patient@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      required
                    />
                    <label className="flex items-center mt-2 text-sm font-medium text-gray-700 mb-1">
                      Password*
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="**********"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
                    <FaHospital className="text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Emergency Contact
                    </h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        placeholder="e.g. Spouse, Parent, Child"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.contactNumber"
                        value={formData.emergencyContact.contactNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-30 0 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-150 shadow-sm flex items-center"
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
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;
