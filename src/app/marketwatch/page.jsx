'use client';
import React from 'react';
import Navbar from '../Components/Navbar';

const Page = () => {
  return (
    <div className="min-h-screen bg-[#071824] text-white">
      {/* Top Section */}
    
       <Navbar/>
  
      
      {/* Menu Section */}
      <div className="flex space-x-4 overflow-x-auto p-4 mt-4">
  {["NSEFUT", "NSEOPT", "MCXFUT", "MCXOPT", "NSE-EQ", "BSE-FUT", "BSE-OPT", "CRYPTO", "FOREX", "COMEX", "GLOBALINDEX"].map((item, index) => (
    <a
      key={index}
      href="/broker/marketwatch"
      className={`px-4 py-2 border-b-3 ${index === 0 ? 'border-blue-500 text-blue-500' : 'border-transparent'} hover:bg-gray-600`}
    >
      {item}
    </a>
  ))}
</div>

      
      {/* Search Section */}
      <div className="p-4 flex items-center space-x-3 bg-gray-800 m-4 rounded-xl">
        <img className="w-6 h-6" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png" alt="search" />
        <a href="/Broker/Search" className="text-white hover:underline">
          Search & Add New Symbols
        </a>
      </div>
      
      {/* Market Data Section */}
      <div className="p-4 space-y-4">
        {[
          { name: "NIFTY", qty: 0, ltp: 22932.45, change: "-150.85 (-0.65)" },
          { name: "NIFTY", qty: 0, ltp: 22799.6, change: "-142.50 (-0.62)" },
        ].map((data, index) => (
          <div key={index} className="border border-gray-700 p-4 rounded-lg bg-gray-800">
            <div className="flex justify-between">
              <p className="text-lg font-bold">{data.name}</p>
              <p className="text-green-400">Qty: {data.qty}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-lg">LTP: {data.ltp}</p>
              <p className="text-red-400">{data.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
