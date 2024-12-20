"use client";
import React, { useEffect, useState } from "react";
import api from "../lib/services/api";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";

const StatusIndicator = ({ status, type }) => {
  let color = "gray";
  
  if (type === "transaction") {
    if (status === "Completed") color = "green";
    else if (status === "Pending") color = "yellow";
    else if (status === "Failed") color = "red";
  } else if (type === "active") {
    color = status ? "green" : "red";
  }

  return (
    <div className="flex justify-center">
      <span
        className={`inline-block h-4 w-4 rounded-full bg-${color}-500`}
        title={type === "active" ? (status ? "Active" : "Inactive") : status}
      ></span>
    </div>
  );
};

const UserTransactionFilter = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(() => {
    return localStorage.getItem("month")
      ? Number(localStorage.getItem("month"))
      : 1;
  });
  const [paymentStatus, setPaymentStatus] = useState(() => {
    return localStorage.getItem("paymentStatus") || "Completed";
  });
  const [year, setYear] = useState(() => {
    return localStorage.getItem("year")
      ? Number(localStorage.getItem("year"))
      : new Date().getFullYear();
  });
  const [userCounts, setUserCounts] = useState({
    paid: 0,
    pending: 0,
    notPaid: 0,
  });

  useEffect(() => {
    localStorage.setItem("month", month);
    localStorage.setItem("year", year);
    localStorage.setItem("paymentStatus", paymentStatus);
  }, [month, year, paymentStatus]);

  const fetchUsersAndFilter = async () => {
    setLoading(true);
    try {
      const usersResponse = await api.getAllUsers();
      const usersData = usersResponse;

      if (!usersData || usersData.length === 0) {
        console.warn("No users found in the response.");
        setUsers([]);
        setFilteredUsers([]);
        return;
      }

      const usersWithFilteredTransactions = await Promise.all(
        usersData.map(async (user) => {
          const transactionsResponse = await api.getTransactionsByUserId(
            user._id
          );
          const relevantTransaction = transactionsResponse.find((transaction) =>
            transaction.monthsPaid.some(
              (monthPaid) =>
                monthPaid.month === month && monthPaid.year === year
            )
          );

          return {
            ...user,
            transactionStatus: relevantTransaction
              ? relevantTransaction.status
              : "No Transaction",
          };
        })
      );

      const counts = {
        paid: usersWithFilteredTransactions.filter(
          (user) => user.transactionStatus === "Completed"
        ).length,
        pending: usersWithFilteredTransactions.filter(
          (user) => user.transactionStatus === "Pending"
        ).length,
        notPaid: usersWithFilteredTransactions.filter(
          (user) => user.transactionStatus === "No Transaction"
        ).length,
      };
      setUserCounts(counts);

      let filtered = usersWithFilteredTransactions;
      
      switch (paymentStatus) {
        case "Completed":
          filtered = filtered.filter(
            (user) => user.transactionStatus === "Completed"
          );
          break;
        case "Pending":
          filtered = filtered.filter(
            (user) => user.transactionStatus === "Pending"
          );
          break;
        case "Not Paid":
          filtered = filtered.filter(
            (user) => user.transactionStatus === "No Transaction"
          );
          break;
      }

      if (sortConfig.key) {
        filtered.sort((a, b) => {
          let aValue, bValue;
          switch (sortConfig.key) {
            case "Name":
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case "Contact":
              aValue = a.mobileNumber.toLowerCase();
              bValue = b.mobileNumber.toLowerCase();
              break;
            case "Date of Birth":
              aValue = new Date(a.dateOfBirth);
              bValue = new Date(b.dateOfBirth);
              break;
            default:
              return 0;
          }
          
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      setUsers(usersData);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error fetching users or transactions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndFilter();
  }, [month, year, paymentStatus, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-semibold mb-14 text-black">
        Monthly Transaction Status
      </h1>

      <div className="max-w-4xl mx-auto bg-white backdrop-blur-sm bg-opacity-80 rounded-xl shadow-md p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="filter-group">
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              id="month"
              className="w-full p-3 bg-white border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i, 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="year" className="block text font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              id="year"
              className="w-full p-3 bg-white border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              id="paymentStatus"
              className="w-full p-3 bg-white border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="p-3 bg-green-500 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Paid Transactions</p>
              <p className="text-2xl font-bold text-green-700">{userCounts.paid}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="p-3 bg-yellow-500 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Transactions</p>
              <p className="text-2xl font-bold text-yellow-700">{userCounts.pending}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="p-3 bg-red-500 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Unpaid Transactions</p>
              <p className="text-2xl font-bold text-red-700">{userCounts.notPaid}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-black" size={24} />
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-lg">
            <div className="max-h-[55vh] overflow-y-auto">
              <table className="min-w-full bg-white border text-black rounded-sm">
                <thead className="py-3">
                  <tr className="text-gray-700 font-bold border-b bg-gray-200 py-3 text-start text-lg uppercase">
                    <th className="text-center px-4 py-2">Status</th>
                    <th
                      className="text-center px-4 py-2 cursor-pointer relative"
                      onClick={() => requestSort("Name")}
                    >
                      Name {getSortIndicator("Name")}
                    </th>
                    <th
                      className="text-center px-4 py-2 cursor-pointer relative"
                      onClick={() => requestSort("Contact")}
                    >
                      Contact {getSortIndicator("Contact")}
                    </th>
                    <th
                      className="text-center px-4 py-2 cursor-pointer relative"
                      onClick={() => requestSort("Date of Birth")}
                    >
                      Date of Birth {getSortIndicator("Date of Birth")}
                    </th>
                    <th className="text-center px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-100">
                        <td className="p-3 text-center">
                          <StatusIndicator status={user.isActive} type="active" />
                        </td>
                        <td className="p-3 text-center text-black">{user.name}</td>
                        <td className="p-3 text-center text-black">{user.mobileNumber}</td>
                        <td className="p-3 text-center text-black">
                          {new Date(user.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-3 text-center flex items-center justify-center">
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
                      <td colSpan="6" className="text-center p-3 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTransactionFilter;