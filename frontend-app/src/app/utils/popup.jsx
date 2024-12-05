// const PopUP = () => {
//   return (
//     <div
//       className="fixed top-16 right-4 z-50 p-4 bg-green-500 text-white rounded-lg shadow-lg animate-slide-down flex items-center space-x-2"
//       style={{ zIndex: 1000 }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6 text-white"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth={2}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9 12l2 2 4-4M15 9l-4 4-2-2"
//         />
//       </svg>
//       <span>Data updated successfully!</span>
//     </div>
//   );
// };
// export default PopUP;

const PopUp = ({ type = "success", message }) => {
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
      {closeIcon}
    </div>
  );
};

export default PopUp;
