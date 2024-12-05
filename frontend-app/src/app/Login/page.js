"use client";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { signIn } from "next-auth/react";

export default function Login() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative backdrop-blur-sm">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-60 backdrop-blur-lg shadow-xl rounded-lg space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/DTU,_Delhi_official_logo.png"
            alt="DTU Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Welcome Text */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black">Welcome to</h1>
          <h2 className="text-3xl font-bold text-black">DTU FLATS</h2>
          <p className="text-sm text-gray-500">
            Bridging Memories, Building Futures
          </p>
        </div>

        {/* Sign in Option */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full px-4 py-3 border border-black rounded-md gap-2 hover:bg-gray-100 text-black transition-transform transform hover:scale-105 bg-black/20 backdrop-blur"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
