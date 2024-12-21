"use client"
import React, { useEffect, useState } from "react";
import List from "./List";

const Page = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Example of fetching data and handling errors
    const fetchData = async () => {
      try {
        // Simulate fetching data or any necessary operations
        // await apiCall();
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return <List />;
};

export default Page;