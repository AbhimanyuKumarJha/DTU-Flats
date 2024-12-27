"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, LogIn, RefreshCcw, HelpCircle, Mail } from "lucide-react";

const AuthError = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Use the useSearchParams hook instead of window.location
    const errorParam = searchParams.get("error");
    console.log("Error parameter:", errorParam); // Debug log

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
    } else {
      // Set a default error message if no error parameter is present
      setError("An unexpected error occurred. Please try again.");
    }
    
    // Trigger fade-in animation
    setFadeIn(true);
  }, [searchParams]); // Add searchParams as dependency

  const handleReturnToLogin = () => {
    setIsLoading(true);
    router.push("/login"); // Make sure this matches your login route exactly (case-sensitive)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-gray-50 to-blue-50 p-4 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed" />
      </div>

      {/* Main card with fade-in animation */}
      <div 
        className={`max-w-md w-full bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden 
        transform transition-all duration-700 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {/* Header section with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center relative overflow-hidden">
          <div className="animate-pulse-slow absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-50" />
          <div className="relative">
            <div className="flex justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="text-white" size={64} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
          </div>
        </div>
        
        {/* Error message section */}
        <div className="p-8 space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-fade-in">
            <p data-testid="error-message" className="text-gray-700 text-center text-lg">
              {error}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReturnToLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 
              transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Return to Login
                </>
              )}
            </button>
            
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 
                rounded-lg transition-colors duration-300 hover:bg-gray-100"
              >
                <RefreshCcw size={16} />
                Retry
              </button>
              <button 
                onClick={() => router.push('/support')}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 
                rounded-lg transition-colors duration-300 hover:bg-gray-100"
              >
                <Mail size={16} />
                Contact Support
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer with help text */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
            <HelpCircle size={14} />
            <p>Need help? Check our <a href="/faq" className="underline hover:text-blue-600">FAQ</a> or contact support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;