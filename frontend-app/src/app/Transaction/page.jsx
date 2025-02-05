"use client";

import React, { useState, useEffect } from "react";
import api from "../lib/services/api";
import { generateAndDownloadPDF } from "../lib/utils/pdfGenerator"; // Import the PDF generator
import Loader from "../New/components/Loader";
import { FaDownload } from "react-icons/fa"; // Import the download icon
// Helper function to get month name from month number
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "short" });
};

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

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterContact, setFilterContact] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.getAllTransactions();

        // Fetch rent rates and discounts
        const rentRates = await api.getRentRates();
        const discountData = await api.getDiscount();
        

        const transactionsWithDetails = data.map((tx) => ({
          ...tx,
          rentRates,
          floorDiscount: discountData[0]?.onFloor || 0,
          yearDiscount: discountData[0]?.onYear || 0,
        }));

        // Sort transactions by transactionDate in descending order
        transactionsWithDetails.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

        setTransactions(transactionsWithDetails);
        setFilteredTransactions(transactionsWithDetails);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply Filters
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by Name
    if (filterName.trim() !== "") {
      filtered = filtered.filter((tx) =>
        tx.userId?.name?.toLowerCase().includes(filterName.trim().toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== "All") {
      filtered = filtered.filter((tx) => tx.status === filterStatus);
    }

    // Filter by Contact
    if (filterContact.trim() !== "") {
      filtered = filtered.filter((tx) =>
        tx.userId?.mobileNumber
          ?.toLowerCase()
          .includes(filterContact.trim().toLowerCase())
      );
    }

    // Filter by Transaction Month
    if (filterMonth !== "") {
      const [year, month] = filterMonth.split("-");
      filtered = filtered.filter((tx) =>
        tx.monthsPaid?.some(
          (mp) => mp.year === parseInt(year) && mp.month === parseInt(month)
        )
      );
    }

    setFilteredTransactions(filtered);
  }, [filterName, filterStatus, filterContact, filterMonth, transactions]);

  // Apply Sorting
  useEffect(() => {
    if (sortConfig.key) {
      const sorted = [...filteredTransactions].sort((a, b) => {
        let aField, bField;

        switch (sortConfig.key) {
          case "Status":
            aField = a.status || "";
            bField = b.status || "";
            break;
          case "Name":
            aField = a.userId?.name || "";
            bField = b.userId?.name || "";
            break;
          case "Contact":
            aField = a.userId?.mobileNumber || "";
            bField = b.userId?.mobileNumber || "";
            break;
          case "From":
            aField =
              a.monthsPaid?.length > 0
                ? a.monthsPaid[0].year * 100 + a.monthsPaid[0].month
                : 0;
            bField =
              b.monthsPaid?.length > 0
                ? b.monthsPaid[0].year * 100 + b.monthsPaid[0].month
                : 0;
            break;
          case "To":
            aField =
              a.monthsPaid?.length > 0
                ? a.monthsPaid[a.monthsPaid.length - 1].year * 100 +
                  a.monthsPaid[a.monthsPaid.length - 1].month
                : 0;
            bField =
              b.monthsPaid?.length > 0
                ? b.monthsPaid[b.monthsPaid.length - 1].year * 100 +
                  b.monthsPaid[b.monthsPaid.length - 1].month
                : 0;
            break;
          case "Transaction Date":
            aField = new Date(a.transactionDate);
            bField = new Date(b.transactionDate);
            break;
          default:
            aField = "";
            bField = "";
        }

        if (aField < bField) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aField > bField) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });

      setFilteredTransactions(sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          {sortConfig.direction === "asc" ? "▲" : "▼"}
        </span>
      );
    }
    return (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0">
        ▲
      </span>
    );
  };

  // Function to calculate rent details (similar to RentDisplay)
  const calculateRentDetails = (transaction) => {
    const baseMonthlyCharge = 1000;
    const rentRates = transaction.rentRates || [];
    const floorDiscount = transaction.floorDiscount || 0;
    const yearDiscount = transaction.yearDiscount || 0;
    const floorNumber = transaction.floorNumber

    const months = transaction.monthsPaid;
    let total = 0;
    const monthlyCalculations = months.map(({ month, year }) => {
      const date = new Date(year, month - 1);
      const applicableRate = rentRates.find(
        (rate) => new Date(rate.effectiveDate) <= date
      );
      const amount = applicableRate ? applicableRate.amount : baseMonthlyCharge;
      total += amount;
      return { month, year, amount };
    });

    const floorDiscountAmount = total * (floorDiscount / 100);
    const yearDiscountAmount = total * (yearDiscount / 100);
    const grandTotal = total - floorDiscountAmount - yearDiscountAmount;

    return {
      monthlyCalculations,
      totalAmount: total,
      floorDiscount,
      yearDiscount,
      floorDiscountAmount,
      floorNumber,
      yearDiscountAmount,
      grandTotal,
    };
  };

  const handleDownload = async (transaction) => {
    try {
      // Fetch user data using the userId from the transaction
      const userData = await api.getUserById(transaction.userId._id);
      console.log("handledownload userdata",userData);
      const rentDetails = calculateRentDetails(transaction);
      const transactionWithRentDetails = { ...transaction, rentDetails, userData }; // Include user data
      await generateAndDownloadPDF(transactionWithRentDetails);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl text-black font-bold mb-6 text-center">
        All Transactions
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
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
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

        {/* Filter by Transaction Month */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Filter by Transaction Month
          </label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="mt-1 p-2 border rounded-md text-black"
          />
        </div>
      </div>
      {/* <div className="flex  text-black font-bold text-lg">
        {" "}
        {filteredTransactions.length} Transactions
      </div> */}

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center text-black ">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto rounded-md overflow-auto max-h-[60vh]">
          <table className="min-w-full bg-white border text-black rounded-sm">
            <thead className="py-3">
              <tr className="text-gray-700 font-bold border-b bg-gray-200 py-3 text-start text-lg uppercase">
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("Status")}
                >
                  Status {getSortIndicator("Status")}
                </th>
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
                  onClick={() => requestSort("From")}
                >
                  From {getSortIndicator("From")}
                </th>
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("To")}
                >
                  To {getSortIndicator("To")}
                </th>
                <th
                  className="text-start px-4 py-2 cursor-pointer relative"
                  onClick={() => requestSort("Transaction Date")}
                >
                  Transaction Date {getSortIndicator("Transaction Date")}
                </th>
                <th className="text-start px-4 py-2"> Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const {
                  userId,
                  status,
                  monthsPaid,
                  _id,
                  transactionDate,
                  rentRates,
                  floorDiscount,
                  yearDiscount,
                } = transaction;

                // Compute From and To dates based on monthsPaid
                if (!monthsPaid || monthsPaid.length === 0) {
                  return (
                    <tr key={_id}>
                      <td className="py-2 px-4 border-b" colSpan={7}>
                        Invalid transaction data.
                      </td>
                    </tr>
                  );
                }

                // Sort monthsPaid
                const sortedMonths = [...monthsPaid].sort((a, b) => {
                  if (a.year === b.year) return a.month - b.month;
                  return a.year - b.year;
                });

                const from = sortedMonths[0];
                const to = sortedMonths[sortedMonths.length - 1];

                const fromDisplay = `${getMonthName(from.month)} ${from.year}`;
                const toDisplay = `${getMonthName(to.month)} ${to.year}`;
                const transactionDateDisplay = new Date(
                  transactionDate
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={_id}>
                    <td className="py-2 px-4 border-b">
                      <StatusIndicator status={status} />
                    </td>
                    <td className="py-2 px-4 border-b">
                      {userId?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {userId?.mobileNumber || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {from ? fromDisplay : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {to ? toDisplay : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transactionDateDisplay || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDownload(transaction)}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <FaDownload className="mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
