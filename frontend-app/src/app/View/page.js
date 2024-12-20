"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/services/api";
import PopUp from "../utils/popup";
import { FaFileDownload } from "react-icons/fa";

// Status Indicator Component
const StatusIndicator = ({ status }) => {
  let color = "gray";
  if (status === "Completed") color = "green";
  else if (status === "Pending") color = "yellow";
  else if (status === "Failed") color = "red";

  return (
    <div className="flex justify-center">
      <span
        className={`inline-block h-4 w-4 rounded-full bg-${color}-500`}
        title={status}
      ></span>
    </div>
  );
};

const ViewPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterContact, setFilterContact] = useState("");
  const [filterDob, setFilterDob] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Fetch all users when the component mounts
  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply Filters and Sorting
  useEffect(() => {
    let filtered = [...users];

    // Filter by Name
    if (filterName.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(filterName.trim().toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        (user) => user.isActive === (filterStatus === "Active")
      );
    }

    // Filter by Contact
    if (filterContact.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.mobileNumber
          .toLowerCase()
          .includes(filterContact.trim().toLowerCase())
      );
    }

    // Filter by Date of Birth
    if (filterDob !== "") {
      filtered = filtered.filter(
        (user) =>
          new Date(user.dateOfBirth).toISOString().split("T")[0] === filterDob
      );
    }

    // Apply Sorting
    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        let aField, bField;

        switch (sortConfig.key) {
          case "Name":
            aField = a.name.toLowerCase();
            bField = b.name.toLowerCase();
            break;
          case "Contact":
            aField = a.mobileNumber.toLowerCase();
            bField = b.mobileNumber.toLowerCase();
            break;
          case "Date of Birth":
            aField = new Date(a.dateOfBirth);
            bField = new Date(b.dateOfBirth);
            break;
          default:
            return 0;
        }

        if (aField < bField) return sortConfig.direction === "asc" ? -1 : 1;
        if (aField > bField) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [users, filterName, filterStatus, filterContact, filterDob, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Define getSortIndicator function
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-black font-bold mb-6 text-center">
        Resident Data
      </h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter by Name */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Filter by Name</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter name"
            className="mt-1 p-2 border rounded-md placeholder-gray-400 text-black"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 p-2 border rounded-md text-black"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Filter by Contact */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Filter by Contact</label>
          <input
            type="text"
            value={filterContact}
            onChange={(e) => setFilterContact(e.target.value)}
            placeholder="Enter contact number"
            className="mt-1 p-2 border rounded-md placeholder-gray-400 text-black"
          />
        </div>

        {/* Filter by Date of Birth */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Filter by Date of Birth
          </label>
          <input
            type="date"
            value={filterDob}
            onChange={(e) => setFilterDob(e.target.value)}
            className="mt-1 p-2 border rounded-md text-black"
          />
        </div>
      </div>

      {/* Users Table */}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg">
        <div className="max-h-[67vh] overflow-y-auto">
          {" "}
          {/* Added a wrapper for vertical scrolling */}
          <table className="min-w-full bg-white border text-black rounded-sm">
            <thead className="py-3">
              <tr className="text-gray-700 font-bold border-b bg-gray-200 py-3 text-start text-lg uppercase">
                <th className="text-start px-4 py-2">Status</th>
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("Name")}
                >
                  Name {getSortIndicator("Name")}
                </th>
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("Contact")}
                >
                  Contact {getSortIndicator("Contact")}
                </th>
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("Date of Birth")}
                >
                  Date of Birth {getSortIndicator("Date of Birth")}
                </th>
                <th className="text-start px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-center">
                      <StatusIndicator
                        status={user.isActive ? "Completed" : "Failed"}
                      />
                    </td>
                    <td className="p-3 text-black">{user.name}</td>
                    <td className="p-3 text-black">{user.mobileNumber}</td>
                    <td className="p-3 text-black">
                      {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3">
                      <Link href={`/View/${user._id}`}>
                        <button className="flex items-center text-blue-500 hover:text-blue-700">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>{" "}
        {/* End of the wrapper for vertical scrolling */}
      </div>

      {/* Popup Notification */}
      {showPopup && <PopUp message={popupMessage} />}
    </div>
  );
};

export default ViewPage;
