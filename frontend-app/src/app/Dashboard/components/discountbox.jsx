import { useState, useEffect } from "react";
import api from "../../lib/services/api";
import { discountSchema } from "../../lib/validations/formSchemas";

const DiscountBox = () => {
  const [onYear, setOnYear] = useState(0);
  const [onFloor, setOnFloor] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [discountId, setDiscountId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      setIsLoading(true);
      api.updateDiscount(discountId, validatedDiscount.data).then(() => {
        setIsLoading(false);
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Success message duration
        setIsEditing(false);
      });
    } else {
      console.error("Invalid discount data");
    }
  };

  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value;
    const numberValue = value === "" ? 0 : +value;
    setter(numberValue);
  };

  return (
    <div className="mt-7 w-4/5 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-center">Rent Discount</h1>
      <div className="grid grid-cols-3 items-center justify-center bg-blue-300 p-2 w-full rounded-md gap-2">
        <div className="flex gap-2">
          <label className="text-gray-800 font-semibold">onYear</label>
          <input
            type="number"
            value={onYear}
            onChange={handleNumberChange(setOnYear)}
            disabled={!isEditing}
            className="max-w-20 px-2 ring-1 ring-gray-300 bg-slate-50 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-gray-800 font-semibold">onFloor</label>
          <input
            type="number"
            value={onFloor}
            onChange={handleNumberChange(setOnFloor)}
            disabled={!isEditing}
            className="max-w-20 px-2 ring-1 ring-gray-300 bg-slate-50 rounded-md"
          />
        </div>
        {isEditing ? (
          <button
            onClick={() => setShowConfirm(true)}
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

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-center mb-4">
              Confirm Update
            </h2>
            <p className="text-sm text-gray-700 text-center">
              Are you sure you want to update the discount details?
            </p>
            <div className="flex justify-center mt-4 gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                {isLoading ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Discount updated successfully!
        </div>
      )}
    </div>
  );
};

export default DiscountBox;
