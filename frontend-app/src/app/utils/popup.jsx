import { useState } from 'react';

const PopUp = ({ type = "success", message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setTimeout(() => {
        setIsVisible(false);
    }, 5000); // Delay of 15000 milliseconds (15 seconds)
  };

  if (!isVisible) return null;
  
  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const icons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const closeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-white opacity-75 cursor-pointer hover:opacity-100"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const defaultMessages = {
    success: "Data updated successfully!",
    error: "Operation failed. Please try again.",
  };

  return (
    <div
      className={`fixed top-16 right-4 z-50 p-4 ${styles[type]} text-white rounded-lg shadow-lg animate-bounce flex items-center justify-between space-x-2`}
    >
      {icons[type]}
      <span>{message || defaultMessages[type]}</span>
      <div onClick={handleClose}>
        {closeIcon}
      </div>
    </div>
  );
};

export default PopUp;
