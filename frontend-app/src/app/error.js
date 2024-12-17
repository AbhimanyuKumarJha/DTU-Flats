"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, LogIn } from "lucide-react";

const AuthError = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "PermissionDenied":
          setError("You don't have permission to access this application.");
          break;
        case "Unauthorized":
          setError("Please log in to access this resource.");
          break;
        case "SessionExpired":
          setError("Your session has expired. Please log in again.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-red-50 border-b border-red-200 p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="text-red-500" size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Authentication Error</h1>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center text-base">
            {error || "An error occurred while processing your request."}
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/Login")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <LogIn size={20} />
              Return to Login
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
          If the issue persists, please contact support.
        </div>
      </div>
    </div>
  );
};

export default AuthError;