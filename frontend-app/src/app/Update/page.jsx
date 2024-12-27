"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "../lib/services/api";
import PopUp from "../utils/popup";
import UserEditDetails from "../Edit/UserEditDetails";
import PaymentCard from "./paymentCard.jsx";
import { getNextMonthYear } from "../lib/utils/dateUtils"; // Utility function to get next month/year
import { FaEye, FaDollarSign, FaEdit, FaSearch, FaUsers, FaUserCheck, FaUserTimes, FaArrowLeft, FaPlus, FaSortAlphaDown, FaSortAlphaUp, FaSpinner, FaCog, FaDatabase, FaExclamationCircle } from 'react-icons/fa'; // Importing React icons
import PaymentSection from "./PaymentSection";

// Status Indicator Component with enhanced styling
const StatusIndicator = ({ status }) => {
  const statusConfig = {
    Completed: "bg-green-500",
    Pending: "bg-yellow-500",
    Failed: "bg-red-500"
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`h-3 w-3 rounded-full ${statusConfig[status]} animate-pulse`}></span>
      {/* <span className="text-sm font-medium text-gray-600">{status}</span> */}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, bgColor }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200`}>
    <div className="p-3 rounded-full bg-white bg-opacity-30">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <div>
      <p className="text-white text-sm font-medium">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  bg-opacity-35 ">
      <div className="flex flex-col items-center space-y-8">
        {/* Primary spinner */}
        <div className="relative">
          <FaSpinner className="w-16 h-16 text-blue-500 animate-spin" />
          <FaCog className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-700 animate-spin-slow" />
        </div>
        
        {/* Loading text with data icons */}
        <div className="flex items-center space-x-3">
          <FaDatabase className="w-5 h-5 text-blue-500 animate-bounce" />
          <span className="text-xl font-semibold text-black">Loading Data</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default function Update() {
  const [paymentmode, setPaymentmode] = useState(false);
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

  // Selected User for Transaction
  const [selectedUser, setSelectedUser] = useState(null);
  const [existingTransactions, setExistingTransactions] = useState([]);

  // Transactions State
  const [transactions, setTransactions] = useState([
    {
      fromMonth: "",
      fromYear: "",
      tillMonth: "",
      tillYear: "",
      paymentMode: "Cash",
      paymentDetails: {
        chequeOrDDNumber: "",
        upiTransactionId: "",
      },
    },
  ]);

  // Edit User ID
  const [editUserId, setEditUserId] = useState(null);

  // Popup State for Payment Card
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Create a ref for the PaymentSection
  const paymentSectionRef = useRef(null);

  // Fetch all users when the component mounts
  const fetchUsers = async () => {
    setLoading(true);
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

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const handleAddPayment = async (user) => {
    setSelectedUser(user);
    setShowPaymentModal(true);
    try {
      const transactions = await api.getTransactionsByUserId(user._id);
      setExistingTransactions(transactions);
      
      // Scroll to PaymentSection
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setShowPopup(true);
      setPopupMessage("Failed to load transactions.");
    }
  };

  const handleBack = () => {
    setPaymentmode(false);
    setSelectedUser(null);
    setExistingTransactions([]);
  };

  const handleTransactionUpdate = (index, updatedTransaction) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = updatedTransaction;
    setTransactions(updatedTransactions);
  };

  const handleAddTransaction = () => {
    // initailly show from month as latest month and year and till month as current month and year
    setTransactions([
      ...transactions,
      {
        fromMonth: "",
        fromYear: "",
        tillMonth: "",
        tillYear: "",
        paymentMode: "Cash",
        paymentDetails: {
          chequeOrDDNumber: "",
          upiTransactionId: "",
        },
      },
    ]);
  };

  const handleTransactionSubmit = async () => {
    try {
      // Fetch existing transactions for the selected user
      const transactionsResponse = await api.getTransactionsByUserId(
        selectedUser._id
      );
      const allExistingTransactions = transactionsResponse;

      // Initialize an array to hold transactions that can be submitted
      const transactionsToSubmit = [];
      let hasAlreadyPaid = false;

      // Iterate through each transaction to check for already paid months
      for (let txn of transactions) {
        const { fromMonth, fromYear, tillMonth, tillYear } = txn;

        // Generate all months covered by the current transaction
        const monthsCovered = [];
        let currentMonth = fromMonth;
        let currentYear = fromYear;

        while (
          currentYear < tillYear ||
          (currentYear === tillYear && currentMonth <= tillMonth)
        ) {
          monthsCovered.push({ month: currentMonth, year: currentYear });
          const next = getNextMonthYear(currentMonth, currentYear);
          currentMonth = next.nextMonth;
          currentYear = next.nextYear;
        }

        // Check if any of the months are already paid
        const alreadyPaidMonths = monthsCovered.filter((m) =>
          allExistingTransactions.some(
            (existingTxn) =>
              existingTxn.monthsPaid.some(
                (paidMonth) =>
                  paidMonth.month === m.month && paidMonth.year === m.year
              ) && existingTxn.status === "Completed"
          )
        );

        if (alreadyPaidMonths.length > 0) {
          hasAlreadyPaid = true;
          // Find the latest paid month to set the next possible month/year
          const latestPaid = alreadyPaidMonths.reduce(
            (prev, current) => {
              if (current.year > prev.year) return current;
              if (current.year === prev.year && current.month > prev.month)
                return current;
              return prev;
            },
            { month: 1, year: 0 }
          );

          const nextPayment = getNextMonthYear(
            latestPaid.month,
            latestPaid.year
          );
          txn.fromMonth = nextPayment.nextMonth;
          txn.fromYear = nextPayment.nextYear;

          // Optionally, you can notify the user about the adjustment
          setShowPopup(true);
          setPopupMessage(
            `Some months are already paid. Adjusting payment to start from ${nextPayment.nextMonth}/${nextPayment.nextYear}.`
          );
        }

        // Check if there are any months left to submit after excluding already paid
        const unpaidMonths = monthsCovered.filter(
          (m) =>
            !allExistingTransactions.some(
              (existingTxn) =>
                existingTxn.monthsPaid.some(
                  (paidMonth) =>
                    paidMonth.month === m.month && paidMonth.year === m.year
                ) && existingTxn.status === "Completed"
            )
        );

        if (unpaidMonths.length > 0) {
          // Update the transaction's tillMonth and tillYear based on unpaid months
          const lastUnpaid = unpaidMonths[unpaidMonths.length - 1];
          txn.tillMonth = lastUnpaid.month;
          txn.tillYear = lastUnpaid.year;
          transactionsToSubmit.push(txn);
        }
      }

      if (transactionsToSubmit.length === 0) {
        // If all transactions are already paid
        if (!hasAlreadyPaid) {
          setShowPopup(true);
          setPopupMessage("No new transactions to submit.");
        }
        return;
      }

      // Submit the filtered transactions
      await api.createTransactions(selectedUser._id, transactionsToSubmit);
      setShowPopup(true);
      setPopupMessage("Transactions added successfully.");

      // Refresh existing transactions
      const fetchedTransactions = await api.getTransactionsByUserId(
        selectedUser._id
      );
      setExistingTransactions(fetchedTransactions);
      setPaymentmode(false);
      setSelectedUser(null);
      setTransactions([
        {
          fromMonth: "",
          fromYear: "",
          tillMonth: "",
          tillYear: "",
          paymentMode: "Cash",
          paymentDetails: {
            chequeOrDDNumber: "",
            upiTransactionId: "",
          },
        },
      ]);

      // Close the payment modal and scroll to the top
      setShowPaymentModal(false);
      window.scrollTo(0, 0); // Scroll to the top of the page
    } catch (err) {
      console.error("Error submitting transactions:", err);
      setShowPopup(true);
      setPopupMessage("Failed to add transactions.");
    }
  };
  const handleEditUser = (userId) => {
    setEditUserId(userId);
  };
  // Utility to check if current month is already paid
  const isCurrentMonthPaid = () => {
    if (!existingTransactions || existingTransactions.length === 0)
      return false;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    return existingTransactions.some(
      (txn) =>
        txn.monthsPaid.some(
          (month) => month.month === currentMonth && month.year === currentYear
        ) && txn.status === "Completed"
    );
  };

  // Determine the starting month and year for the next transaction
  const getNextTransactionStart = () => {
    if (!existingTransactions || existingTransactions.length === 0) {
      const currentDate = new Date();
      const next = getNextMonthYear(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      return next;
    }

    // Find the latest month/year from existing transactions
    let latestMonth = 0;
    let latestYear = 0;

    existingTransactions.forEach((txn) => {
      txn.monthsPaid.forEach((month) => {
        if (
          month.year > latestYear ||
          (month.year === latestYear && month.month > latestMonth)
        ) {
          latestYear = month.year;
          latestMonth = month.month;
        }
      });
    });

    // Calculate the next month and year
    const next = getNextMonthYear(latestMonth, latestYear);
    return next;
  };

  // Assuming you have the counts of residents available
  const totalResidents = users.length;
  const activeResidents = users.filter(user => user.isActive).length;
  const inactiveResidents = totalResidents - activeResidents;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-lg">
          <FaExclamationCircle className="mx-auto text-red-500 text-4xl mb-4 animate-bounce" />
          <div className="text-red-500 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen  p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-center space-x-4">
            <img src="/DTU,_Delhi_official_logo.png" alt="DTU Flats Logo" className="h-16 w-16 object-contain animate-pulse" />
            <h1 className="text-4xl text-center font-bold text-gray-800 mx-auto">Delhi Technological University</h1>
          </div>
        </div>

        {/* Search Section with animation */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-md p-5 mb-8 transform hover:shadow-lg transition-all duration-300">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 animate-pulse" />
            <input
              type="text"
              placeholder="Search residents by name..."
              className="w-full pl-12 pr-4 py-3 text-black rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={FaUsers}
            title="Total Residents"
            value={totalResidents}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-700"
          />
          <StatsCard
            icon={FaUserCheck}
            title="Active Residents"
            value={activeResidents}
            bgColor="bg-gradient-to-r from-green-500 to-green-700"
          />
          <StatsCard
            icon={FaUserTimes}
            title="Inactive Residents"
            value={inactiveResidents}
            bgColor="bg-gradient-to-r from-red-500 to-red-700"
          />
        </div>

        {/* Residents Table */}
        {filterName.length >= 3 && (
          <div className="bg-white rounded-lg overflow-auto max-h-[55vh] shadow-md ">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-bold">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider cursor-pointer font-bold"
                      onClick={() => requestSort("Name")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Name</span>
                        {sortConfig.key === "Name" && (
                          sortConfig.direction === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider cursor-pointer font-bold"
                      onClick={() => requestSort("Contact")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Contact</span>
                        {sortConfig.key === "Contact" && (
                          sortConfig.direction === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider cursor-pointer font-bold"
                      onClick={() => requestSort("Date of Birth")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Date of Birth</span>
                        {sortConfig.key === "Date of Birth" && (
                          sortConfig.direction === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider font-bold">
                      View
                    </th>
                    <th className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider font-bold">
                      Add Payment
                    </th>
                    <th className="px-6 py-3 text-center text-xs  text-gray-900 uppercase tracking-wider font-bold">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y  divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="p-3 text-center">
                          <StatusIndicator
                            status={user.isActive ? "Completed" : "Failed"}
                          />
                        </td>
                        <td className="p-3 text-black">{user.name}</td>
                        <td className="p-3 text-black">
                          {user.mobileNumber}
                        </td>
                        <td className="p-3 text-black">
                          {new Date(user.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Link href={`/View/${user._id}`}>
                            <button className="flex items-center text-blue-500 hover:text-blue-700">
                              <FaEye className="mr-1" /> View
                            </button>
                          </Link>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center">
                            <button
                              className={`flex items-center text-blue-500 hover:text-blue-700 ${
                                isCurrentMonthPaidForUser(user)
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                              onClick={() => handleAddPayment(user)}
                              disabled={isCurrentMonthPaidForUser(user)}
                              title={
                                isCurrentMonthPaidForUser(user)
                                  ? "Payment for current month is already done"
                                  : "Add Payment"
                              }
                            >
                              <FaDollarSign className="mr-1" />
                              {isCurrentMonthPaidForUser(user)
                                ? "Payment Done"
                                : "Add"}
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            className="flex items-center text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditUser(user._id)}
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-3 text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Mode Popup */}
        {showPaymentModal && (
          <div ref={paymentSectionRef}>
            <PaymentSection
              selectedUser={selectedUser}
              transactions={transactions}
              handleTransactionUpdate={handleTransactionUpdate}
              setTransactions={setTransactions}
              handleTransactionSubmit={handleTransactionSubmit}
              setShowPaymentModal={setShowPaymentModal}
            />
          </div>
        )}

        {/* Popups and Modals */}
        {showPopup && (
          <PopUp message={popupMessage} close={() => setShowPopup(false)} />
        )}
        {editUserId && (
          <UserEditDetails
            userId={editUserId}
            onClose={() => setEditUserId(null)}
            onUpdate={fetchUsers}
          />
        )}
      </div>
    </div>
  );

  // Helper function to check if a specific user has paid for the current month
  function isCurrentMonthPaidForUser(user) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Assuming existingTransactions are already fetched for the selected user
    const userTransactions = existingTransactions.filter(
      (txn) => txn.userId === user._id
    );

    return userTransactions.some(
      (txn) =>
        txn.monthsPaid.some(
          (month) => month.month === currentMonth && month.year === currentYear
        ) && txn.status === "Completed"
    );
  }

  // Add this function to handle the edit action
  
}
