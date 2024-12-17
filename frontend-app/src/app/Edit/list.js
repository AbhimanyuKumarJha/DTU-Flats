"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Form from "../New/Form";
import {
  AiOutlineClose,
  AiFillEdit,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
} from "react-icons/ai";
import PopUP from "../utils/popup";

const List = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dobFilter, setDobFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    floorNumber: "",
    units: "",
    monthlyCharges: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    certificateIssued: "",
    isActive: false,
    gender: ""
  });
  const [loading, setLoading] = useState(true); // New state for loading

  const getList = async (filters = {}) => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get("/api/list", { params: filters });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    getList();
  }, [editUserId]);

  useEffect(() => {
    applyFilters(); // Apply filters whenever data or filters change
  }, [data, nameFilter, dobFilter, mobileFilter, statusFilter, sortOrder]);

  const applyFilters = () => {
    // Ensure data is an array before filtering
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return; // Exit the function if data is not an array
    }

    let filtered = [...data]; // Create a copy of data to filter

    if (nameFilter) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (dobFilter) {
      filtered = filtered.filter(
        (user) =>
          new Date(user.dateOfBirth).toISOString().split("T")[0] === dobFilter
      );
    }
    if (mobileFilter) {
      filtered = filtered.filter((user) =>
        user.mobileNumber.includes(mobileFilter)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (user) => user.isActive === (statusFilter === "active")
      );
    }

    // Sorting after filtering
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA > nameB
          ? 1
          : -1
        : nameA < nameB
        ? 1
        : -1;
    });

    setFilteredData(filtered);
  };

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleDobChange = (e) => {
    setDobFilter(e.target.value);
  };

  const handleMobileChange = (e) => {
    setMobileFilter(e.target.value);
  };

  const handleSortByName = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditUser({
      id: user._id,
      name: user.name,
      dateOfBirth: new Date(user.dateOfBirth).toISOString().split("T")[0],
      address: user.address,
      floorNumber: user.floorNumber,
      units: user.units,
      monthlyCharges: user.monthlyCharges,
      mobileNumber: user.mobileNumber,
      alternateMobileNumber: user.alternateMobileNumber,
      certificateIssued: user.certificateIssued,
      isActive: user.isActive,
      gender: user.gender,
    });
  };

  const closeModal = () => {
    setEditUserId(null);
    setShowPopup(false); // Hide popup on modal close
    // on close modal redirect to edit page
    // refresh data
  };

  const triggerPopup = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const clearFilters = () => {
    setNameFilter("");
    setDobFilter("");
    setMobileFilter("");
    setStatusFilter("");
  };

  // Calculate total, active, and inactive residents
  const totalResidents = filteredData.length;
  const activeResidents = filteredData.filter(user => user.isActive).length;
  const inactiveResidents = filteredData.filter(user => !user.isActive).length;

  return (
    <div className="container mx-auto p-4">
      {loading ? ( // Conditional rendering for loading state
        <div className="text-center">
          <p>Loading...</p> {/* Loading message or spinner can be added here */}
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            Residents Data
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              value={nameFilter}
              onChange={handleNameChange}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dobFilter}
              onChange={handleDobChange}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Search by Mobile Number"
              value={mobileFilter}
              onChange={handleMobileChange}
              className="w-full md:w-1/4 p-3 rounded-md border border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div className="text-center mt-4 flex justify-between space-x-5">
              <div className="bg-white bg-opacity-50 p-4 rounded-lg flex justify-center space-x-5">
                <p className="text-black font-bold">Total Residents: {totalResidents}</p>
                <p className="text-black font-bold">Active Residents: {activeResidents}</p>
                <p className="text-black font-bold">Inactive Residents: {inactiveResidents}</p>
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="ml-4 px-4 py-2 rounded bg-blue-500 text-white transition duration-300"
            >
              Clear Filters
            </button>
          </div>

          {/* Responsive Table */}
          <div className="overflow-auto rounded-lg shadow-lg max-h-[550px]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left text-gray-700 font-semibold uppercase bg-gray-200">
                  <th className="p-3">Status</th>
                  <th
                    className="p-3 flex items-center cursor-pointer"
                    onClick={handleSortByName}
                  >
                    Name
                    {sortOrder === "asc" ? (
                      <AiOutlineArrowUp className="ml-2" />
                    ) : (
                      <AiOutlineArrowDown className="ml-2" />
                    )}
                  </th>
                  <th className="p-3">Date of Birth</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-100">
                      <td className="p-3 text-black">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            item.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                      </td>
                      <td className="p-3 text-black">{item.name}</td>
                      <td className="p-3 text-black">
                        {new Date(item.dateOfBirth).toLocaleDateString("en-GB")}
                      </td>
                      <td className="p-3 text-black">{item.mobileNumber}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <AiFillEdit />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-3 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Resident Statistics */}
          <div className="text-center mt-4">
            <p>Total Residents: {totalResidents}</p>
            <p>Active Residents: {activeResidents}</p>
            <p>Inactive Residents: {inactiveResidents}</p>
          </div>

          {/* Edit Modal */}
          {editUserId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full">
                <div className="relative">
                  <Form
                    data={editUser}
                    mode="edit"
                    updatelist={getList}
                    closeModal={closeModal}
                    triggerPopup={triggerPopup}
                  />
                  <button
                    onClick={closeModal}
                    className="absolute top-12 right-12 text-gray-600 hover:text-gray-800"
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Popup */}
          {showPopup && <PopUP />}
        </>
      )}
    </div>
  );
};

export default List;