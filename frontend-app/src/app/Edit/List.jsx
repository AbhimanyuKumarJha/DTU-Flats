"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiFillEdit,
  AiFillDelete,
} from "react-icons/ai";
import UserEditDetails from "./UserEditDetails.jsx";
import api from "../lib/services/api";

const List = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dobFilter, setDobFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUserId, setEditUserId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const getList = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/list", { params: filters });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, [editUserId]);

  useEffect(() => {
    applyFilters();
  }, [data, nameFilter, dobFilter, mobileFilter, statusFilter, sortOrder]);

  const applyFilters = () => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return;
    }

    let filtered = [...data];

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

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  const deleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      await getList();
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const totalResidents = filteredData.length;
  const activeResidents = filteredData.filter(user => user.isActive).length;
  const inactiveResidents = filteredData.filter(user => !user.isActive).length;

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {/* Filters and Stats Section */}
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            Residents Data
          </h1>
          
          {/* Filter inputs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300"
            />
            <input
              type="date"
              value={dobFilter}
              onChange={(e) => setDobFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300"
            />
            <input
              type="text"
              placeholder="Search by Mobile Number"
              value={mobileFilter}
              onChange={(e) => setMobileFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 rounded-md border text-black border-gray-300"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Stats Display */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-center mt-4 flex justify-between space-x-5">
              <div className="bg-white bg-opacity-50 p-4 rounded-lg flex justify-center space-x-5">
                <p className="text-black font-bold">Total Residents: {totalResidents}</p>
                <p className="text-black font-bold">Active Residents: {activeResidents}</p>
                <p className="text-black font-bold">Inactive Residents: {inactiveResidents}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setNameFilter("");
                setDobFilter("");
                setMobileFilter("");
                setStatusFilter("");
              }}
              className="ml-4 px-4 py-2 rounded bg-blue-500 text-white"
            >
              Clear Filters
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-auto rounded-lg shadow-lg max-h-[56vh]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left text-gray-700 font-semibold uppercase bg-gray-200">
                  <th className="p-3">Status</th>
                  <th
                    className="p-3 flex items-center cursor-pointer"
                    onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
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
                {filteredData.map((item) => (
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
                    <td className="p-3 flex space-x-8">
                      <button
                        onClick={() => setEditUserId(item._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <AiFillEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl text-black font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4 text-black">Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 bg-blue-400 rounded hover:bg-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(userToDelete)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Success Popup */}
          {showDeleteSuccess && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
              User deleted successfully!
            </div>
          )}

          {/* User Edit Modal */}
          {editUserId && (
            <UserEditDetails
              userId={editUserId}
              onClose={() => setEditUserId(null)}
              onUpdate={getList}
            />
          )}
        </>
      )}
    </div>
  );
};

export default List;