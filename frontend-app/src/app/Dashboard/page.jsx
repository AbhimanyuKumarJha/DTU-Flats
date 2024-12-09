"use client";
import AdminList from "./components/adminList";
import RentList from "./components/rentList";
import { signOut } from "next-auth/react";
const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 w-full mt-5 min-h-[50vh]">
        <AdminList />
        <RentList />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full mt-5">
        <button
          onClick={() => signOut({ callbackUrl: "/Login" })}
          className=" text-gray-800 hover:text-black bg-blue-500 hover:bg-blue-600 px-2 rounded-md w-24 h-8 text-center"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;
