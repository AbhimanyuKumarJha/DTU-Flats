"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthError = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      if (errorParam === "PermissionDenied") {
        setError("You don't have permission to access this application.");
      } else {
        setError("An unknown error occurred.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => router.push("/Login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default AuthError;
