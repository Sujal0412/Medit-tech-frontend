import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  X,
  ArrowLeft,
  Trash2,
  RefreshCw,
  Layers,
  Building,
  PlusCircle,
  CheckCircle,
  Users,
  AlertCircle,
  Bed,
  Calendar,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

function CheckBed() {
  const [beds, setBeds] = useState([]);
  const [bedStats, setBedStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
  });
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    ward: "all",
    floor: "all",
  });
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [patientForm, setPatientForm] = useState({
    name: "",
    id: "",
    admissionDate: new Date().toISOString().split("T")[0],
    expectedDischarge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    reason: "",
    notes: "",
  });
  const [newBedForm, setNewBedForm] = useState({
    bedId: "",
    type: "General",
    ward: "",
    floor: "",
    status: "Available",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [typeOptions, setTypeOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);

  // Fetch beds on component mount and when filters change
  useEffect(() => {
    fetchBeds();
  }, []);

  // Real API fetch function
  const fetchBeds = async (filterParams = filters) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/bed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
        params: {
          type: filterParams.type !== "all" ? filterParams.type : undefined,
          status:
            filterParams.status !== "all" ? filterParams.status : undefined,
          ward: filterParams.ward !== "all" ? filterParams.ward : undefined,
          floor: filterParams.floor !== "all" ? filterParams.floor : undefined,
          search: search || undefined,
        },
      });

      // Format the response data for our UI
      setBeds(
        response.data.beds.map((bed) => ({
          id: bed.bedId,
          type: bed.type,
          ward: bed.ward,
          floor: bed.floor,
          status: bed.status,
          patient: bed.patientDetails
            ? {
                name: bed.patientDetails.name,
                id: bed.patientDetails.patientIdentifier,
                admissionDate: new Date(
                  bed.patientDetails.admissionDate
                ).toLocaleDateString(),
                expectedDischarge: new Date(
                  bed.patientDetails.expectedDischargeDate
                ).toLocaleDateString(),
              }
            : null,
        }))
      );

      // Set stats
      setBedStats(
        response.data.stats || {
          total: response.data.beds.length,
          available: response.data.beds.filter((b) => b.status === "Available")
            .length,
          occupied: response.data.beds.filter((b) => b.status === "Occupied")
            .length,
          maintenance: response.data.beds.filter(
            (b) => b.status === "Maintenance"
          ).length,
        }
      );

      // Set filter options from metadata
      if (response.data.metadata) {
        setTypeOptions(response.data.metadata.types || []);
        setWardOptions(response.data.metadata.wards || []);
        setFloorOptions(response.data.metadata.floors || []);
      }
    } catch (error) {
      console.error("Error fetching beds:", error);
      toast.error("Failed to load bed data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      // Create updated filters object
      const updatedFilters = { ...prev, [name]: value };

      // Apply the filters by calling fetchBeds on the next tick
      setTimeout(() => {
        fetchBeds(updatedFilters);
      }, 0);

      return updatedFilters;
    });
  };

  const filteredBeds = beds;
  console.log(beds);
  const handleAssignBed = (bed) => {
    setSelectedBed(bed);
    setShowAssignModal(true);
  };

  const handleDischarge = async (bedId) => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/api/bed/${bedId}/discharge`,
        { notes: "Regular discharge" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Patient discharged successfully");
      fetchBeds();
    } catch (error) {
      console.error("Error discharging patient:", error);
      toast.error(
        error.response?.data?.message || "Failed to discharge patient"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/api/bed/${selectedBed.id}/assign`,
        {
          name: patientForm.name,
          id: patientForm.id, // Ensure this matches the backend field
          admissionDate: patientForm.admissionDate,
          expectedDischarge: patientForm.expectedDischarge,
          reason: patientForm.reason || "General admission",
          notes: patientForm.notes || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Patient assigned successfully");
      setShowAssignModal(false);
      setPatientForm({
        name: "",
        id: "",
        admissionDate: new Date().toISOString().split("T")[0],
        expectedDischarge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        reason: "",
        notes: "",
      });
      fetchBeds();
    } catch (error) {
      console.error("Error assigning patient:", error);
      toast.error(error.response?.data?.message || "Failed to assign patient");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/bed`,
        {
          bedId: newBedForm.bedId,
          type: newBedForm.type,
          ward: newBedForm.ward,
          floor: newBedForm.floor,
          status: newBedForm.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Bed created successfully");
      setShowAddBedModal(false);
      setNewBedForm({
        bedId: "",
        type: "General",
        ward: "",
        floor: "",
        status: "Available",
      });
      fetchBeds();
    } catch (error) {
      console.error("Error creating bed:", error);
      toast.error(error.response?.data?.message || "Failed to create bed");
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaintenance = async (bedId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/api/bed/${bedId}/maintenance`,
        { notes: "Regular maintenance" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Bed set to maintenance successfully");
      fetchBeds();
    } catch (error) {
      console.error("Error setting maintenance:", error);
      toast.error(error.response?.data?.message || "Failed to set maintenance");
    }
  };

  const handleClearMaintenance = async (bedId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/api/bed/${bedId}/maintenance/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Bed maintenance cleared successfully");
      fetchBeds();
    } catch (error) {
      console.error("Error clearing maintenance:", error);
      toast.error(
        error.response?.data?.message || "Failed to clear maintenance"
      );
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      type: "all",
      status: "all",
      ward: "all",
      floor: "all",
    };

    setFilters(defaultFilters);
    setSearch("");

    // Fetch with reset filters
    fetchBeds(defaultFilters);
  };

  // Update handleManualRefresh to use the current filters
  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchBeds();
  };

  const handleRemoveBed = async (bedId) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/api/bed/${bedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      toast.success(`Bed ${bedId} has been removed successfully`);
      // Refresh the bed list
      fetchBeds();
    } catch (error) {
      console.error("Error removing bed:", error);

      if (error.response?.data?.message === "Cannot delete an occupied bed") {
        toast.error(
          "Cannot remove an occupied bed. Please discharge the patient first."
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to remove bed");
      }
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && beds.length === 0) {
    return <LoadingState />;
  }

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

          <div>
            <h1 className="text-2xl font-bold text-white">Bed Management</h1>
            <p className="text-gray-400">
              Overview of all beds, occupancy and patient assignments
            </p>
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
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 bg-[#171B24] text-gray-400 rounded-full hover:bg-[#1F242E] hover:text-blue-400 transition-colors"
            >
              {viewMode === "grid" ? (
                <Layers className="w-5 h-5" />
              ) : (
                <Building className="w-5 h-5" />
              )}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddBedModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Bed
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={fadeIn}>
            <StatCard
              title="Total Beds"
              value={bedStats.total}
              icon={<Bed className="text-blue-400" />}
              color="bg-blue-900/20"
              borderColor="border-blue-800/30"
              iconBg="bg-blue-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Available"
              value={bedStats.available}
              icon={<CheckCircle className="text-green-400" />}
              color="bg-green-900/20"
              borderColor="border-green-800/30"
              iconBg="bg-green-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Occupied"
              value={bedStats.occupied}
              icon={<Users className="text-yellow-400" />}
              color="bg-yellow-900/20"
              borderColor="border-yellow-800/30"
              iconBg="bg-yellow-900/30"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <StatCard
              title="Maintenance"
              value={bedStats.maintenance}
              icon={<AlertCircle className="text-red-400" />}
              color="bg-red-900/20"
              borderColor="border-red-800/30"
              iconBg="bg-red-900/30"
            />
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col gap-4 mb-6"
        >
          <div className="bg-[#0D1117] rounded-lg border border-gray-800 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by bed ID, patient name, ward or type..."
                className="w-full pl-10 pr-10 py-2 outline-none bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchBeds();
                  }
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    fetchBeds();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#0D1117] rounded-lg border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-3 text-gray-300">
              <Filter className="h-4 w-4" />
              <h3 className="text-sm font-medium">Filter Beds</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Bed Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Ward</label>
                <select
                  name="ward"
                  value={filters.ward}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Wards</option>
                  {wardOptions.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Floor
                </label>
                <select
                  name="floor"
                  value={filters.floor}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm bg-[#171B24] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Floors</option>
                  {floorOptions.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bed List Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-between items-center mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-100">
            {filteredBeds.length} {filteredBeds.length === 1 ? "Bed" : "Beds"}{" "}
            Found
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${
                viewMode === "grid"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-800/30"
                  : "bg-[#171B24] text-gray-400 border border-gray-800"
              }`}
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${
                viewMode === "list"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-800/30"
                  : "bg-[#171B24] text-gray-400 border border-gray-800"
              }`}
            >
              <Building className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Bed Cards */}
        {viewMode === "grid" ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
          >
            {filteredBeds.length > 0 ? (
              filteredBeds.map((bed) => (
                <motion.div key={bed.id} variants={fadeIn}>
                  <BedCard
                    bed={bed}
                    onAssign={handleAssignBed}
                    onDischarge={handleDischarge}
                    onMaintenance={handleSetMaintenance}
                    onClearMaintenance={handleClearMaintenance}
                    onRemove={handleRemoveBed}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 bg-[#0D1117] rounded-lg border border-gray-800">
                <Bed className="w-16 h-16 text-gray-700 mb-3" />
                <h3 className="text-lg font-medium text-gray-200 mb-1">
                  No beds found
                </h3>
                <p className="text-gray-400 mb-2 text-center max-w-md">
                  {search
                    ? "No beds match your search criteria"
                    : "Try adjusting your filters"}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 flex items-center text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden mb-10"
          >
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-[#0A0C10]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bed ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0D1117] divide-y divide-gray-800">
                {filteredBeds.length > 0 ? (
                  filteredBeds.map((bed) => (
                    <tr key={bed.id} className="hover:bg-[#171B24]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {bed.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {bed.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {bed.ward}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={bed.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {bed.patient ? bed.patient.name : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {bed.status === "Available" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAssignBed(bed)}
                              className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => handleSetMaintenance(bed.id)}
                              className="text-yellow-400 hover:text-yellow-300 font-medium ml-3"
                            >
                              Maintenance
                            </button>
                            <button
                              onClick={() => handleRemoveBed(bed.id)}
                              className="text-red-400 hover:text-red-300 font-medium ml-3"
                            >
                              Remove
                            </button>
                          </div>
                        ) : bed.status === "Occupied" ? (
                          <button
                            onClick={() => handleDischarge(bed.id)}
                            className="text-red-400 hover:text-red-300 font-medium"
                          >
                            Discharge
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleClearMaintenance(bed.id)}
                              className="text-green-400 hover:text-green-300 font-medium"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => handleRemoveBed(bed.id)}
                              className="text-red-400 hover:text-red-300 font-medium ml-3"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Bed className="w-12 h-12 text-gray-700 mb-3" />
                        <h3 className="text-lg font-medium text-gray-200 mb-1">
                          No beds found
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Modals - Updated for dark theme */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#0D1117] rounded-xl p-6 max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh] border border-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Assign Bed {selectedBed.id}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="bg-blue-900/30 rounded-full p-2">
                  <Bed className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">
                    {selectedBed.type} Bed
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedBed.ward}, {selectedBed.floor}
                  </p>
                </div>
                <StatusBadge status={selectedBed.status} className="ml-auto" />
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientForm.name}
                  onChange={(e) =>
                    setPatientForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientForm.id}
                  onChange={(e) =>
                    setPatientForm((prev) => ({ ...prev, id: e.target.value }))
                  }
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Admission Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={patientForm.admissionDate}
                      onChange={(e) =>
                        setPatientForm((prev) => ({
                          ...prev,
                          admissionDate: e.target.value,
                        }))
                      }
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Expected Discharge
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={patientForm.expectedDischarge}
                      onChange={(e) =>
                        setPatientForm((prev) => ({
                          ...prev,
                          expectedDischarge: e.target.value,
                        }))
                      }
                      className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Reason for Admission
                </label>
                <input
                  type="text"
                  value={patientForm.reason}
                  onChange={(e) =>
                    setPatientForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="General admission"
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={patientForm.notes}
                  onChange={(e) =>
                    setPatientForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#171B24] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 font-medium shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Assign Bed"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Bed Modal - similarly styled */}
      {showAddBedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0D1117] rounded-xl p-6 max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh] border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Bed</h2>
              <button
                onClick={() => setShowAddBedModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="bg-green-900/30 rounded-full p-2">
                  <Bed className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">
                    Create a new bed in the system
                  </p>
                  <p className="text-xs text-gray-400">
                    Fill in the details for the new bed
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddBedSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bed ID*
                </label>
                <input
                  type="text"
                  value={newBedForm.bedId}
                  onChange={(e) =>
                    setNewBedForm((prev) => ({
                      ...prev,
                      bedId: e.target.value,
                    }))
                  }
                  placeholder="B101"
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bed Type*
                </label>
                <select
                  value={newBedForm.type}
                  onChange={(e) =>
                    setNewBedForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Special">Special</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ward*
                  </label>
                  <input
                    type="text"
                    value={newBedForm.ward}
                    onChange={(e) =>
                      setNewBedForm((prev) => ({
                        ...prev,
                        ward: e.target.value,
                      }))
                    }
                    placeholder="General Ward"
                    className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Floor*
                  </label>
                  <input
                    type="text"
                    value={newBedForm.floor}
                    onChange={(e) =>
                      setNewBedForm((prev) => ({
                        ...prev,
                        floor: e.target.value,
                      }))
                    }
                    placeholder="1st Floor"
                    className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newBedForm.status}
                  onChange={(e) =>
                    setNewBedForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full bg-[#171B24] border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddBedModal(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#171B24] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 font-medium shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Bed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Updated BedCard component
const BedCard = ({
  bed,
  onAssign,
  onDischarge,
  onMaintenance,
  onClearMaintenance,
  onRemove,
}) => {
  const getCardColor = (status) => {
    switch (status) {
      case "Available":
        return {
          bg: "bg-green-900/20",
          border: "border-green-800/30",
          statusBg: "bg-green-900/30",
          statusText: "text-green-300",
        };
      case "Occupied":
        return {
          bg: "bg-yellow-900/20",
          border: "border-yellow-800/30",
          statusBg: "bg-yellow-900/30",
          statusText: "text-yellow-300",
        };
      case "Maintenance":
        return {
          bg: "bg-red-900/20",
          border: "border-red-800/30",
          statusBg: "bg-red-900/30",
          statusText: "text-red-300",
        };
      default:
        return {
          bg: "bg-gray-800",
          border: "border-gray-700",
          statusBg: "bg-gray-700",
          statusText: "text-gray-300",
        };
    }
  };

  const colors = getCardColor(bed.status);

  return (
    <div
      className={`${colors.bg} rounded-lg p-4 border ${colors.border} transition-all hover:shadow-glow`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-medium text-gray-400">
            {bed.type} Bed
          </span>
          <h3 className="text-lg font-semibold text-gray-100">{bed.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={bed.status} />
          {bed.status !== "Occupied" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(bed.id);
              }}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Remove Bed"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5" />
            <span>
              {bed.ward}, {bed.floor}
            </span>
          </div>
        </div>
      </div>

      {bed.status === "Occupied" && bed.patient && (
        <div className="bg-[#171B24] rounded-md p-3 mb-4 border border-gray-800">
          <h4 className="font-medium text-gray-200 text-sm mb-1">
            Patient Information
          </h4>
          <p className="text-gray-100 font-medium">{bed.patient.name}</p>
          <p className="text-xs text-gray-400">ID: {bed.patient.id}</p>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-400">
            <div>
              <span className="block">Admitted</span>
              <span className="font-medium text-gray-300">
                {bed.patient.admissionDate}
              </span>
            </div>
            <div>
              <span className="block">Expected Discharge</span>
              <span className="font-medium text-gray-300">
                {bed.patient.expectedDischarge}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2">
        {bed.status === "Available" ? (
          <>
            <button
              onClick={() => onAssign(bed)}
              className="flex-1 py-2 rounded-md bg-blue-900/30 text-blue-400 text-sm font-medium hover:bg-blue-900/40 transition-colors border border-blue-800/30"
            >
              Assign
            </button>
            <button
              onClick={() => onMaintenance(bed.id)}
              className="flex-1 py-2 rounded-md bg-yellow-900/30 text-yellow-400 text-sm font-medium hover:bg-yellow-900/40 transition-colors border border-yellow-800/30"
            >
              Maintenance
            </button>
          </>
        ) : bed.status === "Occupied" ? (
          <button
            onClick={() => onDischarge(bed.id)}
            className="w-full py-2 rounded-md bg-red-900/30 text-red-400 text-sm font-medium hover:bg-red-900/40 transition-colors border border-red-800/30"
          >
            Discharge
          </button>
        ) : (
          <button
            onClick={() => onClearMaintenance(bed.id)}
            className="w-full py-2 rounded-md bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/40 transition-colors border border-green-800/30"
          >
            Clear Maintenance
          </button>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status, className = "" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-900/30 text-green-300 border border-green-800/30";
      case "Occupied":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-800/30";
      case "Maintenance":
        return "bg-red-900/30 text-red-300 border border-red-800/30";
      default:
        return "bg-gray-800 text-gray-300 border border-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, borderColor, iconBg }) => (
  <div
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between transition-shadow hover:shadow-glow`}
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
    <div className="mt-6 text-blue-400 font-medium">Loading bed data...</div>
  </div>
);

export default CheckBed;
