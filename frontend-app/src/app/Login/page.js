"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Loader } from "lucide-react";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Handle URL params for errors
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");

    if (errorParam) {
      switch (errorParam) {
        case "PermissionDenied":
          setError("You don't have permission to access this application.");
          break;
        case "AuthenticationRequired":
          setError("You need to be signed in to access this page.");
          break;
        default:
          setError("An unknown error occurred.");
      }
    }

    // Trigger fade-in animation
    setFadeIn(true);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" /> */}
      </div>

      {/* Glass card with fade-in animation */}
      <div 
        className={`relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all duration-700 ${
          fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* Logo and Title with hover effect */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-6 transform transition-transform hover:scale-110">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to DTU FLATS
          </h2>
          <p className="text-gray-500 mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Animated error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg animate-shake">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-gray-700 
              bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100
              border border-gray-200 shadow-sm transform transition-all duration-200 
              hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer text with gradient */}
        <p className="text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;