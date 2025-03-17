"use client";

import { useState } from "react";
import { FaTrash, FaPlus, FaChartBar, FaShoppingCart, FaBolt, FaCog } from "react-icons/fa";
import BottomNav from "../BotomNav";

const MarketWatch = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-[#071824] h-screen text-white flex flex-col"> 
      {/* Funds & Balance Section */}
      <div className="p-4 border-b border-gray-700 container mx-auto">  
        <h2 className="text-lg font-semibold">Funds</h2>
        <div className="flex lg:justify-between flex-col mt-2 gap-4 ">
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
<div>
<p className=" container mx-auto text-xs text-gray-400  mb-6 p-2 border-b border-gray-700">
          Trade smart, trade happy. Let your profits smile back at you!
        </p>
</div>
      {/* Market Category Buttons */}
      <h2 className="text-lg font-semibold mb-4 container mx-auto">MarketWatch</h2>
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {["NSEFUT", "NSEOPT", "MCXFUT", "MCXOPT", "NSE-EQ", "BSE-FUT", "BSE-OPT", "CRYPTO", "FOREX", "COMEX"].map(
          (item, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-800 rounded-md text-gray-300 hover:bg-green-600 transition"
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Search Bar  */}
      <div className="flex items-center bg-gray-900 rounded-md p-2 mx-4 my-2">
        <input
          type="text"
          placeholder="Search Symbols..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-4 py-2 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
        />
        <FaTrash className="text-gray-400 hover:text-red-500 cursor-pointer mx-2" />
        <FaPlus className="text-gray-400 hover:text-green-500 cursor-pointer mx-2" />
      </div>

      {/* Stock List */}
      <div className="flex-grow p-4">
        <div className="flex justify-between bg-gray-800 p-4 rounded-lg">
          <div>
            <h2 className="text-lg font-semibold">AARTIIND</h2>
            <p className="text-sm text-gray-400">27 FEB</p>
          </div>
          <div className="text-right">
            <p className="text-lg">411.5</p>
            <p className="text-sm text-green-500">+12.15 (2.86%)</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
    <BottomNav/>
    </div>
  );
};

export default MarketWatch;
