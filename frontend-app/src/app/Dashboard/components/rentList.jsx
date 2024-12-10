import { useEffect, useState } from "react";
import api from "../../lib/services/api";
import { FaTrash, FaPlus } from "react-icons/fa";
import { rentRateSchema } from "../../lib/validations/formSchemas";
import DiscountBox from "./discountbox";
const RentList = () => {
  const [rentList, setRentList] = useState([]);
  const [rentRate, setRentRate] = useState("");
  const [fromDate, setFromDate] = useState("");

  const formattedDate = fromDate ? new Date(`${fromDate}-01`) : null;

  const validatedRentRate =
    fromDate && rentRate
      ? rentRateSchema.safeParse({
          amount: Number(rentRate),
          effectiveDate: formattedDate,
        })
      : null;

  useEffect(() => {
    api.getAllRentRates().then((data) => setRentList(data));
    // console.log(rentList);
  }, []);
  const handleDelete = (rentId) => {
    api.deleteRentRate(rentId).then((data) => {
      setRentList(rentList.filter((rent) => rent._id !== rentId));
    });
  };
  const handleAddRentRate = () => {
    if (validatedRentRate?.success) {
      api
        .createRentRate({
          amount: validatedRentRate.data.amount,
          effectiveDate: formattedDate,
        })
        .then((data) => {
          setRentList([...rentList, data]);
          setRentRate("");
          setFromDate("");
        });
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="flex flex-col items-center  h-full w-full rounded-lg bg-gray-100 p-4 text-gray-800">
      <h1 className="text-2xl font-bold mt-3 mb-3">Rent History</h1>
      <div className="flex flex-col items-center justify-center text-gray-800 gap-2 w-5/6">
        <div className="flex items-center justify-center gap-2 h-fit bg-amber-400 p-2 w-full rounded-md ">
          <input
            type="text"
            placeholder="New Rate rate"
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
            onClick={handleAddRentRate}
          >
            <FaPlus />
          </button>
        </div>
        {rentList.map((rent) => (
          <div
            key={rent._id}
            className="grid grid-cols-9 gap-4 rounded-md bg-amber-200 p-2 items-center w-full"
          >
            <p className="col-span-4">
              <b>RentRate:</b> {rent.amount}
            </p>
            <p className="col-span-4">
              <b>From Date:</b> {formatDisplayDate(rent.effectiveDate)}
            </p>
            <button
              className="bg-red-500 text-white p-2 rounded-md col-span-1 w-fit"
              onClick={() => handleDelete(rent._id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <DiscountBox />
    </div>
  );
};

export default RentList;
