"use client";
import React, { useState } from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaBolt,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import BottomNav from "../BotomNav";
import Link from "next/link";

const page = () => {
  const [showFunds, setShowFunds] = useState(false);
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700 container mx-auto relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={() => setShowFunds(!showFunds)}
            className="text-white focus:outline-none"
          >
            <FaChevronDown
              className={`transition-transform ${
                showFunds ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {showFunds && (
          <div className="p-4 bg-gray-800 border-t border-gray-700 mt-2  w-full left-0 top-0 shadow-lg">
            <h2 className="text-lg font-semibold">Funds</h2>
            <div className="flex lg:justify-between flex-col mt-2 gap-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Ledger Balance</p>
                  <p className="text-xl font-bold">₹7,243,81</p>
                </div>
                <div>
                  <p className="text-sm">Margin Available</p>
                  <p className="text-lg">₹0</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Margin Used</p>
                  <p className="text-lg">₹0</p>
                </div>
                <div>
                  <p className="text-sm">M2M Available</p>
                  <p className="text-lg">₹0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-xl container mx-auto">
        <div className="space-y-2">
          <h1 className="font-bold">Margin Available</h1>
          <p className="text-2xl">₹0</p>
          <Link href={"/withdraw"}>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Withdraw
          </button>
          </Link>
         <Link href={"/deposite"}>
         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-4">
            Deposit
          </button>
         </Link>
        </div>
     
      </div>
      <div className="space-y-2 mt-4 p-4 bg-gray-800 flex gap-4 rounded-xl container mx-auto">
          <div >
            <h1 className="font-bold">Userid</h1>
            <p>KEI508</p>
          </div>
          <div>
            <h1 className="font-bold">Username</h1>
            <p>DEMO</p>
          </div>
        </div> 
        <div className="mt-4 p-4 bg-gray-800 rounded-xl container mx-auto mb-4">
  {["Ledger Logs", "Margin", "Change Password", "Scripts Setting", "Reports", "Logout"].map((item, index) => (
    <div
      key={index}
      className="py-3 border-b border-gray-700 text-white cursor-pointer hover:text-blue-400 transition"
    >
      {item}
    </div>
  ))}
</div>


      {/* Bottom Navigation */}
     <BottomNav/>
    </div>
  );
};

export default page;
