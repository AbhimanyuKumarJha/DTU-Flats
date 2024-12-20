"use client";
import React, { useEffect, useState } from "react";
import api from "../lib/services/api";
import Link from "next/link";
import { FaSpinner, FaTimes, FaMoneyBillWave } from "react-icons/fa";

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

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
//       <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//         >
//           <FaTimes size={24} />
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const CollectionBreakdownModal = ({ totalCollection, baseRent, discounts, userBreakdown }) => {
//     return (
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-6">Collection Breakdown</h2>
        
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Base Information</h3>
//           <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//             <div>
//               <p className="text-sm text-gray-600">Base Rent</p>
//               <p className="font-medium">₹{baseRent.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Available Discounts</p>
//               <p className="font-medium">Floor: {discounts.floor}% | Year: {discounts.year}%</p>
//             </div>
//           </div>
//         </div>
  
//         <div className="space-y-6">
//           {/* Regular Users Section */}
//           <div className="border-b pb-4">
//             <h3 className="text-lg font-semibold mb-2">Regular Users (No Discount)</h3>
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Users Count</p>
//                   <p className="font-medium">{userBreakdown?.noDiscount?.length || 0}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="font-medium">₹{totalCollection.breakdown.noDiscount.toLocaleString()}</p>
//                 </div>
//               </div>
              
//               <div className="mt-2">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Users:</p>
//                 <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
//                   {userBreakdown?.noDiscount?.map(user => (
//                     <p key={user._id} className="text-sm text-gray-700 py-1">{user.name}</p>
//                   )) || "No users in this category"}
//                 </div>
//               </div>
  
//               <div className="mt-4 text-sm text-gray-500">
//                 Calculation: {userBreakdown?.noDiscount?.length || 0} users × ₹{baseRent.toLocaleString()} = ₹{totalCollection.breakdown.noDiscount.toLocaleString()}
//               </div>
//             </div>
//           </div>
  
//           {/* Floor Discount Users Section */}
//           <div className="border-b pb-4">
//             <h3 className="text-lg font-semibold mb-2">Floor Discount Users ({discounts.floor}% off)</h3>
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Users Count</p>
//                   <p className="font-medium">{userBreakdown?.floorDiscount?.length || 0}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="font-medium">₹{totalCollection.breakdown.floorDiscount.toLocaleString()}</p>
//                 </div>
//               </div>
  
//               <div className="mt-2">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Users:</p>
//                 <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
//                   {userBreakdown?.floorDiscount?.map(user => (
//                     <p key={user._id} className="text-sm text-gray-700 py-1">{user.name}</p>
//                   )) || "No users in this category"}
//                 </div>
//               </div>
  
//               <div className="mt-4 text-sm text-gray-500">
//                 Calculation: {userBreakdown?.floorDiscount?.length || 0} users × ₹{baseRent.toLocaleString()} × {(1 - discounts.floor/100).toFixed(2)} = ₹{totalCollection.breakdown.floorDiscount.toLocaleString()}
//               </div>
//             </div>
//           </div>
  
//           {/* Year Discount Users Section */}
//           <div className="border-b pb-4">
//             <h3 className="text-lg font-semibold mb-2">Year Discount Users ({discounts.year}% off)</h3>
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Users Count</p>
//                   <p className="font-medium">{userBreakdown?.yearDiscount?.length || 0}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="font-medium">₹{totalCollection.breakdown.yearDiscount.toLocaleString()}</p>
//                 </div>
//               </div>
  
//               <div className="mt-2">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Users:</p>
//                 <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
//                   {userBreakdown?.yearDiscount?.map(user => (
//                     <p key={user._id} className="text-sm text-gray-700 py-1">{user.name}</p>
//                   )) || "No users in this category"}
//                 </div>
//               </div>
  
//               <div className="mt-4 text-sm text-gray-500">
//                 Calculation: {userBreakdown?.yearDiscount?.length || 0} users × ₹{baseRent.toLocaleString()} × {(1 - discounts.year/100).toFixed(2)} = ₹{totalCollection.breakdown.yearDiscount.toLocaleString()}
//               </div>
//             </div>
//           </div>
  
//           {/* Both Discounts Users Section */}
//           <div className="border-b pb-4">
//             <h3 className="text-lg font-semibold mb-2">Users with Both Discounts ({discounts.floor}% + {discounts.year}% off)</h3>
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Users Count</p>
//                   <p className="font-medium">{userBreakdown?.bothDiscounts?.length || 0}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="font-medium">₹{totalCollection.breakdown.bothDiscounts.toLocaleString()}</p>
//                 </div>
//               </div>
  
//               <div className="mt-2">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Users:</p>
//                 <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
//                   {userBreakdown?.bothDiscounts?.map(user => (
//                     <p key={user._id} className="text-sm text-gray-700 py-1">{user.name}</p>
//                   )) || "No users in this category"}
//                 </div>
//               </div>
  
//               <div className="mt-4 text-sm text-gray-500">
//                 Calculation: {userBreakdown?.bothDiscounts?.length || 0} users × ₹{baseRent.toLocaleString()} × {(1 - discounts.floor/100).toFixed(2)} × {(1 - discounts.year/100).toFixed(2)} = ₹{totalCollection.breakdown.bothDiscounts.toLocaleString()}
//               </div>
//             </div>
//           </div>
  
//           {/* Total Collection Summary */}
//           <div className="mt-6 bg-blue-50 p-6 rounded-lg">
//             <h3 className="text-xl font-semibold text-blue-800 mb-4">Total Collection Summary</h3>
//             <div className="space-y-2 text-sm text-blue-700">
//               <p>Regular Users: ₹{totalCollection.breakdown.noDiscount.toLocaleString()}</p>
//               <p>Floor Discount Users: ₹{totalCollection.breakdown.floorDiscount.toLocaleString()}</p>
//               <p>Year Discount Users: ₹{totalCollection.breakdown.yearDiscount.toLocaleString()}</p>
//               <p>Both Discounts Users: ₹{totalCollection.breakdown.bothDiscounts.toLocaleString()}</p>
//               <p className="text-xl font-bold text-blue-900 pt-2 border-t">
//                 Total: ₹{totalCollection.amount.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
  

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
  const [totalCollection, setTotalCollection] = useState({
    amount: 0,
    breakdown: {
      noDiscount: 0,
      floorDiscount: 0,
      yearDiscount: 0,
      bothDiscounts: 0
    }
  });
  const [baseRent, setBaseRent] = useState(0);
  const [discounts, setDiscounts] = useState({ floor: 0, year: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("month", month);
    localStorage.setItem("year", year);
    localStorage.setItem("paymentStatus", paymentStatus);
  }, [month, year, paymentStatus]);

  const calculateTotalCollection = async (usersWithTransactions) => {
    try {
      // Fetch rent rates and discounts
      const rentRatesResponse = await api.getAllRentRates();
      const discountsResponse = await api.getDiscount();
      
      // Find applicable rent rate for the current month/year
      const currentDate = new Date(year, month - 1);
      const applicableRate = rentRatesResponse
        .filter(rate => new Date(rate.effectiveDate) <= currentDate)
        .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0];
      
      if (!applicableRate) return;

      const baseRent = applicableRate.amount;
      
      // Get discount percentages
      const floorDiscount = discountsResponse.find(d => d.onFloor)?.onFloor || 0;
      const yearDiscount = discountsResponse.find(d => d.onYear)?.onYear || 0;

      // Initialize counters for different user categories
      let noDiscountUsers = 0;
      let floorDiscountUsers = 0;
      let yearDiscountUsers = 0;
      let bothDiscountUsers = 0;

      // Categorize users based on their discount eligibility
      usersWithTransactions.forEach(user => {
        if (user.transactionStatus === "Completed") {
          const hasFloorDiscount = user.floorNumber.length === 4; // Has all floors
          const hasYearDiscount = user.transactions.some(transaction => 
            transaction.monthsPaid.length === 12 && transaction.monthsPaid.every(mp => mp.year === year)
          );

          if (hasFloorDiscount && hasYearDiscount) bothDiscountUsers++;
          else if (hasFloorDiscount) floorDiscountUsers++;
          else if (hasYearDiscount) yearDiscountUsers++;
          else noDiscountUsers++;
        }
      });

      // Calculate amounts for each category
      const noDiscountAmount = baseRent * noDiscountUsers;
      const floorDiscountAmount = baseRent * (1 - floorDiscount / 100) * floorDiscountUsers;
      const yearDiscountAmount = baseRent * (1 - yearDiscount / 100) * yearDiscountUsers;
      const bothDiscountsAmount = baseRent * (1 - (floorDiscount + yearDiscount) / 100) * bothDiscountUsers;

      const totalAmount = noDiscountAmount + floorDiscountAmount + yearDiscountAmount + bothDiscountsAmount;

      setTotalCollection({
        amount: totalAmount,
        breakdown: {
          noDiscount: noDiscountAmount,
          floorDiscount: floorDiscountAmount,
          yearDiscount: yearDiscountAmount,
          bothDiscounts: bothDiscountsAmount
        }
      });

    } catch (error) {
      console.error("Error calculating total collection:", error);
    }
  };

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

      await calculateTotalCollection(usersWithFilteredTransactions);

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
      return sortConfig.direction === "asc" ? "▲" : "��";
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <div 
           
            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-all duration-200"
          >
            <div className="p-3 bg-blue-500 rounded-full mr-4">
              <FaMoneyBillWave className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Collection</p>
              <p className="text-2xl font-bold text-blue-700">₹{totalCollection.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
          >
            <CollectionBreakdownModal 
              totalCollection={totalCollection}
              baseRent={baseRent}
              discounts={discounts}
            />
          </Modal> */}
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