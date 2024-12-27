import { useState, useEffect } from "react";
import api from "../../lib/services/api";
import { discountSchema } from "../../lib/validations/formSchemas";
import { motion, AnimatePresence } from "framer-motion";
import Loader from './Loader';

export const DiscountBox = () => {
  const [onYear, setOnYear] = useState(0);
  const [onFloor, setOnFloor] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [discountId, setDiscountId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const validatedDiscount = discountSchema.safeParse({
    onYear: onYear,
    onFloor: onFloor,
  });

  useEffect(() => {
    api.getDiscount()
      .then((data) => {
        setOnYear(data[0].onYear);
        setOnFloor(data[0].onFloor);
        setDiscountId(data[0]._id);
        setLoading(false);
      });
  }, []);

  const handleUpdate = () => {
    if (validatedDiscount?.success) {
      setIsLoading(true);
      api.updateDiscount(discountId, validatedDiscount.data)
        .then(() => {
          setIsLoading(false);
          setShowConfirm(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          setIsEditing(false);
        });
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <h2 className="text-xl font-semibold text-white">Discounts</h2>
        </div>
        
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Yearly Discount (%)</label>
                <input
                  type="number"
                  value={onYear}
                  onChange={(e) => setOnYear(Number(e.target.value))}
                  disabled={!isEditing}
                  className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Floor Discount (%)</label>
                <input
                  type="number"
                  value={onFloor}
                  onChange={(e) => setOnFloor(Number(e.target.value))}
                  disabled={!isEditing}
                  className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isEditing ? () => setShowConfirm(true) : () => setIsEditing(true)}
                  className={`w-full px-4 py-2 rounded-lg shadow-md transition-all duration-200 
                    ${isEditing 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } text-white`}
                >
                  {isEditing ? 'Update' : 'Edit'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-md mx-4 w-full"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Update
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to update the discount rates?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors duration-200 flex items-center gap-2"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <span className="text-lg">✓</span>
            <span>Discount rates updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiscountBox;
