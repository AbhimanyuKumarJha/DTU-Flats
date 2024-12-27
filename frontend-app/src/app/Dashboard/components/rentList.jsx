import { useEffect, useState } from "react";
import api from "../../lib/services/api";
import { FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { rentRateSchema } from "../../lib/validations/formSchemas";
import DiscountBox from "./discountbox";

const RentList = () => {
  const [rentList, setRentList] = useState([]);
  const [rentRate, setRentRate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentRentId, setCurrentRentId] = useState(null);
  const [creationTimestamps, setCreationTimestamps] = useState({});
  const [loading, setLoading] = useState(true);

  // Calculate one month back for database
  const getAdjustedDate = (inputDate) => {
    const date = new Date(`${inputDate}-01`);
    date.setMonth(date.getMonth() - 1); // Subtract one month
    return date;
  };

  const formattedDate = fromDate ? getAdjustedDate(fromDate) : null;

  const validatedRentRate =
    fromDate && rentRate
      ? rentRateSchema.safeParse({
          amount: Number(rentRate),
          effectiveDate: formattedDate,
        })
      : null;

  useEffect(() => {
    setLoading(true);
    api.getAllRentRates().then((data) => {
      setRentList(data);
      const timestamps = data.reduce((acc, rent) => {
        acc[rent._id] = new Date(rent.createdAt).getTime();
        return acc;
      }, {});
      setCreationTimestamps(timestamps);
      setLoading(false);
    });
  }, []);

  const handleDelete = () => {
    api.deleteRentRate(currentRentId).then(() => {
      setRentList(rentList.filter((rent) => rent._id !== currentRentId));
      setShowDeleteConfirmation(false);
      setSuccessMessage("Rent rate deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    });
  };

  const handleAddRentRate = () => {
    if (validatedRentRate?.success) {
      api
        .createRentRate({
          amount: validatedRentRate.data.amount,
          effectiveDate: formattedDate, // Send adjusted date to the database
        })
        .then((data) => {
          setRentList([...rentList, data]);
          setRentRate("");
          setFromDate("");
          setShowAddConfirmation(false);
          setSuccessMessage("Rent rate added successfully!");
          setTimeout(() => setSuccessMessage(null), 3000);
        });
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1); // Add one month for UI display
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const canEditRent = (rentId) => {
    const now = Date.now();
    const creationTime = creationTimestamps[rentId];
    return creationTime && now - creationTime <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };
  const timeRemainingToEdit = (rentId) => {
    const now = Date.now();
    const creationTime = creationTimestamps[rentId];
    if (!creationTime) return null;
    const timeLeft = 24 * 60 * 60 * 1000 - (now - creationTime);
    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="flex flex-col items-center h-full w-full rounded-lg bg-white bg-opacity-55 backdrop-blur-sm p-4 text-gray-800">
      <h1 className="text-2xl font-bold mt-3 mb-3">Rent History</h1>

      {loading ? (
        <FaSpinner className="animate-spin text-blue-500" size={24} />
      ) : (
        <>
          {successMessage && (
            <div className="mb-4 w-5/6 bg-green-200 text-green-800 p-3 rounded-md text-center">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col items-center justify-center text-gray-800 gap-2 w-5/6">
            <div className="flex items-center justify-center gap-2 h-fit bg-gradient-to-r from-blue-100 to-blue-300 p-2 w-full rounded-md ">
              <input
                type="text"
                placeholder="New Rent Rate"
                value={rentRate}
                onChange={(e) => setRentRate(e.target.value)}
                className="h-8 bg-none border-none rounded-md outline-none w-full text-base text-black p-2 "
              />
              <input
                type="month"
                placeholder="From month"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-8 bg-none border-none rounded-md outline-none w-full text-base text-black p-2"
              />
              <button
                className="h-8 bg-blue-500 text-white p-2 rounded-md"
                onClick={() => setShowAddConfirmation(true)}
              >
                <FaPlus />
              </button>
              
            </div>

            {rentList.map((rent) => (
              <div
                key={rent._id}
                className="grid grid-cols-9 gap-4 rounded-md bg-slate-200 p-2 items-center w-full"
              >
                <p className="col-span-4">
                  <b>Rent Rate:</b> {rent.amount}
                </p>
                <p className="col-span-4">
                  <b>From Date:</b> {formatDisplayDate(rent.effectiveDate)}
                </p>
                {canEditRent(rent._id) && (
                  <button
                    className="bg-red-500 text-white p-2 rounded-md col-span-1 w-fit"
                    onClick={() => {
                      setCurrentRentId(rent._id);
                      setShowDeleteConfirmation(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className=" text-red-700 font-bold mt-2">
            ( Rent Rate can be edit only within 24 hours )
          </div>

          <DiscountBox />

          {/* Confirmation for deletion */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4">Are you sure you want to delete this rent rate?</p>
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-md"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handleDelete}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation for addition */}
          {showAddConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Addition</h2>
                <p className="mb-4">
                  Are you sure you want to add a rent rate of {rentRate} starting from {fromDate}?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-md"
                    onClick={() => setShowAddConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleAddRentRate}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RentList;