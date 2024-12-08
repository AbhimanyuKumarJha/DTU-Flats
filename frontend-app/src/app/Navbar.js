"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaPlus,
  FaEdit,
  FaExchangeAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaEye,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't render navbar on login page or if not authenticated
  if (pathname === "/Login" || !session) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-30 backdrop-blur-md p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            DTU FLATS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/New"
              className="flex items-center space-x-2 text-gray-800 border-b-2 border-transparent hover:border-blue-800"
            >
              <FaPlus className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5" />
              <span className="font-bold">New Record</span>
            </Link>

            <Link
              href="/View"
              className="flex items-center space-x-2 text-gray-800 border-b-2 border-transparent hover:border-blue-800"
            >
              <FaEye className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5" />
              <span className="font-bold">View</span>
            </Link>

            <Link
              href="/Edit"
              className="flex items-center space-x-2 text-gray-800 border-b-2 border-transparent hover:border-blue-800"
            >
              <FaEdit className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5" />
              <span className="font-bold">Edit</span>
            </Link>

            <Link
              href="/Transaction"
              className="flex items-center space-x-2 text-gray-800 border-b-2 border-transparent hover:border-blue-800"
            >
              <FaExchangeAlt className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5" />
              <span className="font-bold">Transaction</span>
            </Link>
          </div>

          {/* User Profile/Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => signOut({ callbackUrl: "/Login" })}
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-600"
            >
              <FaUser />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              href="/New"
              className="block text-gray-800 hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              New Record
            </Link>
            <Link
              href="/View"
              className="block text-gray-800 hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              View
            </Link>
            <Link
              href="/Update"
              className="block text-gray-800 hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Update
            </Link>
            <Link
              href="/Transaction"
              className="block text-gray-800 hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Transaction
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/Login" })}
              className="block text-gray-800 hover:text-gray-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
