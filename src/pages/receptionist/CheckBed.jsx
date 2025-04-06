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

  if (loading && beds.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="h-full w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bed Management</h1>
            <p className="text-gray-500">
              Overview of all beds, occupancy and patient assignments
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className={`p-2 rounded-full transition-colors ${
                refreshing
                  ? "bg-blue-100 text-blue-600 animate-spin"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
            >
              {viewMode === "grid" ? (
                <Layers className="w-5 h-5" />
              ) : (
                <Building className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowAddBedModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg hover:from-green-600 hover:to-emerald-500 flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Bed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Beds"
            value={bedStats.total}
            icon={<Bed className="text-blue-500" />}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
            borderColor="border-blue-200"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Available"
            value={bedStats.available}
            icon={<CheckCircle className="text-green-500" />}
            color="bg-gradient-to-br from-green-50 to-green-100"
            borderColor="border-green-200"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Occupied"
            value={bedStats.occupied}
            icon={<Users className="text-amber-500" />}
            color="bg-gradient-to-br from-amber-50 to-amber-100"
            borderColor="border-amber-200"
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Maintenance"
            value={bedStats.maintenance}
            icon={<AlertCircle className="text-red-500" />}
            color="bg-gradient-to-br from-red-50 to-red-100"
            borderColor="border-red-200"
            iconBg="bg-red-100"
          />
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by bed ID, patient name, ward or type..."
                className="w-full pl-10 pr-10 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <Filter className="h-4 w-4" />
              <h3 className="text-sm font-medium">Filter Beds</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Bed Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-xs text-gray-500 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Ward</label>
                <select
                  name="ward"
                  value={filters.ward}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-xs text-gray-500 mb-1">
                  Floor
                </label>
                <select
                  name="floor"
                  value={filters.floor}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredBeds.length} {filteredBeds.length === 1 ? "Bed" : "Beds"}{" "}
            Found
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {filteredBeds.length > 0 ? (
              filteredBeds.map((bed) => (
                <BedCard
                  key={bed.id}
                  bed={bed}
                  onAssign={handleAssignBed}
                  onDischarge={handleDischarge}
                  onMaintenance={handleSetMaintenance}
                  onClearMaintenance={handleClearMaintenance}
                  onRemove={handleRemoveBed} // Add this prop
                />
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <Bed className="w-16 h-16 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No beds found
                </h3>
                <p className="text-gray-500 mb-2 text-center max-w-md">
                  {search
                    ? "No beds match your search criteria"
                    : "Try adjusting your filters"}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-10">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBeds.length > 0 ? (
                  filteredBeds.map((bed) => (
                    <tr key={bed.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bed.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.ward}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={bed.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.patient ? bed.patient.name : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {bed.status === "Available" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAssignBed(bed)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => handleSetMaintenance(bed.id)}
                              className="text-amber-600 hover:text-amber-900 font-medium ml-3"
                            >
                              Maintenance
                            </button>

                            {/* Add Remove Button */}
                            <button
                              onClick={() => handleRemoveBed(bed.id)}
                              className="text-red-600 hover:text-red-900 font-medium ml-3"
                            >
                              Remove
                            </button>
                          </div>
                        ) : bed.status === "Occupied" ? (
                          <button
                            onClick={() => handleDischarge(bed.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Discharge
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleClearMaintenance(bed.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Clear
                            </button>

                            {/* Add Remove Button */}
                            <button
                              onClick={() => handleRemoveBed(bed.id)}
                              className="text-red-600 hover:text-red-900 font-medium ml-3"
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
                        <Bed className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          No beds found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Assign Bed {selectedBed.id}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2">
                  <Bed className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {selectedBed.type} Bed
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBed.ward}, {selectedBed.floor}
                  </p>
                </div>
                <StatusBadge status={selectedBed.status} className="ml-auto" />
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientForm.id}
                  onChange={(e) =>
                    setPatientForm((prev) => ({ ...prev, id: e.target.value }))
                  }
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border py-2 pl-10 pr-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border py-2 pl-10 pr-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 font-medium shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Assign Bed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddBedModal && (
        <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Bed
              </h2>
              <button
                onClick={() => setShowAddBedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2">
                  <Bed className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Create a new bed in the system
                  </p>
                  <p className="text-xs text-gray-500">
                    Fill in the details for the new bed
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddBedSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bed Type*
                </label>
                <select
                  value={newBedForm.type}
                  onChange={(e) =>
                    setNewBedForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border py-2 px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddBedModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg hover:from-green-600 hover:to-emerald-500 font-medium shadow-sm"
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

// Updated BedCard component with maintenance actions
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
          bg: "bg-green-50",
          border: "border-green-100",
          statusBg: "bg-green-100",
          statusText: "text-green-800",
        };
      case "Occupied":
        return {
          bg: "bg-amber-50",
          border: "border-amber-100",
          statusBg: "bg-amber-100",
          statusText: "text-amber-800",
        };
      case "Maintenance":
        return {
          bg: "bg-red-50",
          border: "border-red-100",
          statusBg: "bg-red-100",
          statusText: "text-red-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-100",
          statusBg: "bg-gray-100",
          statusText: "text-gray-800",
        };
    }
  };

  const colors = getCardColor(bed.status);

  return (
    <div
      className={`${colors.bg} rounded-lg p-4 border ${colors.border} transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-medium text-gray-500">
            {bed.type} Bed
          </span>
          <h3 className="text-lg font-semibold text-gray-800">{bed.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={bed.status} />
          {bed.status !== "Occupied" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(bed.id);
              }}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Remove Bed"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5" />
            <span>
              {bed.ward}, {bed.floor}
            </span>
          </div>
        </div>
      </div>

      {bed.status === "Occupied" && bed.patient && (
        <div className="bg-white rounded-md p-3 mb-4 border border-gray-100">
          <h4 className="font-medium text-gray-800 text-sm mb-1">
            Patient Information
          </h4>
          <p className="text-gray-700 font-medium">{bed.patient.name}</p>
          <p className="text-xs text-gray-500">ID: {bed.patient.id}</p>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-500">
            <div>
              <span className="block">Admitted</span>
              <span className="font-medium text-gray-700">
                {bed.patient.admissionDate}
              </span>
            </div>
            <div>
              <span className="block">Expected Discharge</span>
              <span className="font-medium text-gray-700">
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
              className="flex-1 py-2 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Assign
            </button>
            <button
              onClick={() => onMaintenance(bed.id)}
              className="flex-1 py-2 rounded-md bg-amber-100 text-amber-700 text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              Maintenance
            </button>
          </>
        ) : bed.status === "Occupied" ? (
          <button
            onClick={() => onDischarge(bed.id)}
            className="w-full py-2 rounded-md bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Discharge
          </button>
        ) : (
          <button
            onClick={() => onClearMaintenance(bed.id)}
            className="w-full py-2 rounded-md bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors"
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
        return "bg-green-100 text-green-800";
      case "Occupied":
        return "bg-amber-100 text-amber-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    className={`${color} rounded-lg p-4 border ${borderColor} flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}
  >
    <div>
      <p className="text-xs font-medium text-gray-600">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
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
    <div className="mt-6 text-blue-700 font-medium">Loading bed data...</div>
  </div>
);

export default CheckBed;
