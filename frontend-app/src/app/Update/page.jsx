"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/services/api";
import PopUp from "../utils/popup";

import PaymentCard from "./paymentCard.jsx";
import { getNextMonthYear } from "../lib/utils/dateUtils"; // Utility function to get next month/year

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

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const handleAddPayment = async (user) => {
    setSelectedUser(user);
    setPaymentmode(true);
    try {
      const transactions = await api.getTransactionsByUserId(user._id);
      setExistingTransactions(transactions);
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
    } catch (err) {
      console.error("Error submitting transactions:", err);
      setShowPopup(true);
      setPopupMessage("Failed to add transactions.");
    }
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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-4 text-black">
        Add New Payment
      </h1>
      <div className="flex flex-col mt-4 items-center justify-center">
        <div className="w-2/3">
          <input
            type="text"
            placeholder="Enter name"
            className="border border-gray-300 rounded-md p-2 w-full mx-auto h-16 text-xl text-black focus:outline-none focus:ring-2 focus:shadow-lg "
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <p className="text-sm text-black">Enter at least 3 characters</p>
        </div>

        {
          /* Display the table only if there are at least 3 characters in the input */
          filterName.length >= 3 && (
            <div className="w-4/5 bg-white rounded-md p-2">
              {!paymentmode ? (
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
                      <th className="text-start px-4 py-2">View</th>
                      <th className="text-start px-4 py-2">Add Payment</th>
                    </tr>
                  </thead>
                  <tbody>
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
                          <td className="p-3">
                            <Link href={`/View/${user._id}`}>
                              <button className="flex items-center text-blue-500 hover:text-blue-700">
                                View
                              </button>
                            </Link>
                          </td>
                          <td className="p-3">
                            <button
                              className={`text-center self-center flex items-center text-blue-500 hover:text-blue-700 ${
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
                              {isCurrentMonthPaidForUser(user)
                                ? "Payment Done"
                                : "Add"}
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
              ) : (
                <div className="w-full">
                  <button
                    onClick={handleBack}
                    className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
                  >
                    &larr; Back to Users
                  </button>
                  {isCurrentMonthPaid() ? (
                    <div className="text-center text-green-500 font-semibold">
                      Payment for the current month is already done.
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className=" text-black font-semibold">
                          Name: {selectedUser.name}
                        </div>
                        <div className=" text-black font-semibold">
                          Contact: {selectedUser.mobileNumber}
                        </div>
                        <div className=" text-black font-semibold">
                          Floor discount:{" "}
                          {selectedUser.floorNumber.length === 4 ? "Yes" : "No"}
                        </div>
                      </div>

                      <div className="text-black">
                        {transactions.map((txn, index) => (
                          <PaymentCard
                            key={index}
                            isFloorDiscount={
                              selectedUser.floorNumber.length === 4
                                ? true
                                : false
                            }
                            transaction={txn}
                            index={index}
                            isFirst={index === 0}
                            onUpdate={(updatedTxn) =>
                              handleTransactionUpdate(index, updatedTxn)
                            }
                            onRemove={() => {
                              const updated = transactions.filter(
                                (_, i) => i !== index
                              );
                              setTransactions(updated);
                            }}
                            isOnly={transactions.length === 1}
                            mode="create"
                          />
                        ))}
                        {/*
                        //not need to add more than one transaction as we are adding multiple months at once
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                          onClick={handleAddTransaction}
                        >
                          Add Another Transaction
                        </button> */}
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ml-2"
                          onClick={handleTransactionSubmit}
                        >
                          Submit Transactions
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        }
      </div>
      {showPopup && (
        <PopUp message={popupMessage} close={() => setShowPopup(false)} />
      )}
    </>
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
}
