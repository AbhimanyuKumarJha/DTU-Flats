import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '@/app/lib/services/api';

const CustomMonthCalendar = ({ 
  userId, 
  selectedMonth = new Date().getMonth() + 1,
  selectedYear = new Date().getFullYear(),
  onSelect, 
  onClose 
}) => {
  // State management
  const [paidMonths, setPaidMonths] = useState([]);
  const [currentYear, setCurrentYear] = useState(selectedYear || new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized paid months set for efficient lookup
  const paidMonthsSet = useMemo(() => {
    return new Set(
      paidMonths.map(pm => `${pm.year}-${pm.month}`)
    );
  }, [paidMonths]);

  // Fetch paid months for the user
  useEffect(() => {
    const fetchPaidMonths = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await api.getTransactionsByUserId(userId);
        
        // Transform transactions into paid months list
        const paidMonthsList = response.flatMap(transaction => 
          transaction.monthsPaid.map(mp => ({
            month: mp.month,
            year: mp.year,
            amount: transaction.calculatedAmount,
            paymentMode: transaction.paymentMode
          }))
        );

        setPaidMonths(paidMonthsList);
        setError(null);
      } catch (error) {
        console.error('Error fetching paid months:', error);
        setError('Failed to load paid months');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaidMonths();
  }, [userId]);

  // Generate calendar grid with enhanced information
  const generateCalendarGrid = useCallback(() => {
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => {
      const monthNumber = index + 1;
      const isPaid = paidMonthsSet.has(`${currentYear}-${monthNumber}`);
      const paidMonthDetails = paidMonths.find(
        pm => pm.year === currentYear && pm.month === monthNumber
      );

      return (
        <div 
          key={month} 
          className="relative"
        >
          <button
            onClick={() => {
              onSelect(monthNumber, currentYear);
              onClose();
            }}
            aria-label={`Select ${month} ${currentYear}`}
            aria-pressed={monthNumber === selectedMonth && selectedYear === currentYear}
            className={`w-full p-2 rounded-md transition-colors duration-200 relative ${
              isPaid 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-white text-black hover:bg-gray-100 border'
            } ${
              monthNumber === selectedMonth && selectedYear === currentYear
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >
            {month}
            {isPaid && paidMonthDetails && (
              <span 
                className="absolute top-0 right-0 m-1 text-xs bg-white text-green-600 rounded-full px-1"
                title={`Paid via ${paidMonthDetails.paymentMode}`}
              >
                ✓
              </span>
            )}
          </button>
          {isPaid && paidMonthDetails && (
            <div 
              className="absolute z-10 hidden group-hover:block bg-white border rounded shadow-lg p-2 text-xs mt-1"
            >
              <p>Amount: ${paidMonthDetails.amount}</p>
              <p>Payment: {paidMonthDetails.paymentMode}</p>
            </div>
          )}
        </div>
      );
    });
  }, [
    currentYear, 
    paidMonthsSet, 
    paidMonths,
    selectedMonth, 
    selectedYear, 
    onSelect, 
    onClose
  ]);

  // Year navigation
  const changeYear = (direction) => {
    setCurrentYear(prev => prev + direction);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          <p className="mt-2 text-black">Loading paid months...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-red-500">
          <p>{error}</p>
          <button 
            onClick={onClose} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main calendar render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => changeYear(-1)} 
            className="text-gray-600 hover:text-gray-900"
            aria-label="Previous Year"
          >
            ◀ Previous Year
          </button>
          <h2 className="text-xl text-black font-bold">{currentYear}</h2>
          <button 
            onClick={() => changeYear(1)} 
            className="text-gray-600 hover:text-gray-900"
            aria-label="Next Year"
          >
            Next Year ▶
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {generateCalendarGrid()}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
CustomMonthCalendar.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedMonth: PropTypes.number,
  selectedYear: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

// Default props
CustomMonthCalendar.defaultProps = {
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear()
};

export default CustomMonthCalendar;