import React, { useState } from 'react';
import { FaUser, FaPhone, FaBuilding, FaPlus } from 'react-icons/fa';
import PaymentCard from './paymentCard';

const PaymentSection = ({ selectedUser, transactions, handleTransactionUpdate, setTransactions, handleTransactionSubmit, setShowPaymentModal }) => {
  // const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = () => {
    handleTransactionSubmit();
    // setPopupMessage('Transactions submitted successfully!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // setTimeout(() => {
    //     setPopupMessage('');
    // }, 5000);
  };

  return (
    <div className="bg-opacity-60  bg-white    mt-6  via-gray-50 to-blue-50 p-8 px-10 rounded-2xl shadow-lg">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* User Details Card */}
      <div className="bg-white rounded-xl p-6 w-fit -mb-[16vh] shadow-md justify-center align-middle border border-gray-100 hover:shadow-lg transition-all duration-300 mx-auto">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <FaUser className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-semibold text-gray-800">
                {selectedUser && selectedUser.name ? selectedUser.name : 'Unknown User'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <FaPhone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Contact</div>
              <div className="font-semibold text-gray-800">
                {selectedUser && selectedUser.mobileNumber ? selectedUser.mobileNumber : 'No Contact Info'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FaBuilding className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Floor Discount</div>
              <div className="font-semibold text-gray-800">
                {selectedUser && selectedUser.floorNumber && selectedUser.floorNumber.length === 4 ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-2 -mb-24 mt-14">
        {transactions.map((txn, index) => (
          <PaymentCard
            key={index}
            isFloorDiscount={selectedUser && selectedUser.floorNumber && selectedUser.floorNumber.length === 4}
            transaction={txn}
            index={index}
            isFirst={index === 0}
            onUpdate={(updatedTxn) => handleTransactionUpdate(index, updatedTxn)}
            onRemove={() => {
              const updated = transactions.filter((_, i) => i !== index);
              setTransactions(updated);
            }}
            isOnly={transactions.length === 1}
            mode="create"
            userId={selectedUser ? selectedUser._id : null}
            onClose={() => setShowPaymentModal(false)}
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end -mt-6 space-x-4 important">
        <button
          onClick={handleSubmit}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <FaPlus className="w-5 h-5 mr-2" />
          Submit Transaction
        </button>
      </div>

      {/* Popup Message */}
      {/* {popupMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {popupMessage}
        </div>
      )} */}
    </div>
  );
};

export default PaymentSection;