import { useState, useEffect } from "react";
import api from "../../lib/services/api";
import { discountSchema } from "../../lib/validations/formSchemas";

const DiscountBox = () => {
  const [onYear, setOnYear] = useState(0);
  const [onFloor, setOnFloor] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [discountId, setDiscountId] = useState(null);

  const validatedDiscount = discountSchema.safeParse({
    onYear: onYear,
    onFloor: onFloor,
  });
  useEffect(() => {
    api.getDiscount().then((data) => {
      setOnYear(data[0].onYear);
      setOnFloor(data[0].onFloor);
      setDiscountId(data[0]._id);
    });
  }, []);

  const handleUpdate = () => {
    if (validatedDiscount.success) {
      api.updateDiscount(discountId, validatedDiscount.data).then((data) => {
        setIsEditing(false);
        console.log(isEditing);
      });
    } else {
      console.log("Invalid discount");
    }
  };
  // Helper function to handle number inputs
  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value;
    // Convert to number. You can choose parseInt, parseFloat, or unary +
    const numberValue = value === "" ? 0 : +value;
    setter(numberValue);
  };
  return (
    <div className="mt-7 w-4/5 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-center">Rent Discount</h1>
      <div className="grid grid-cols-3 items-center justify-center bg-amber-400 p-2 w-full rounded-md gap-2 ">
        <div className="flex gap-2">
          <label className="text-gray-800 font-semibold">onYear</label>
          <input
            type="number"
            value={onYear}
            onChange={handleNumberChange(setOnYear)}
            disabled={!isEditing}
            className="max-w-20 px-2 ring-1 ring-gray-300 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-gray-800 font-semibold">onFloor</label>
          <input
            type="number"
            value={onFloor}
            onChange={handleNumberChange(setOnFloor)}
            disabled={!isEditing}
            className="max-w-20 px-2 ring-1 ring-gray-300 rounded-md"
          />
        </div>
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white text-center text-sm rounded-md w-24 h-8 mr-0 ml-auto"
          >
            Update
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white text-center text-sm rounded-md w-24 h-8 mr-0 ml-auto"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DiscountBox;
