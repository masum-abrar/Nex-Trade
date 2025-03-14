'use client';
import React from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import { useState } from 'react';

const HomePage = () => {
    const [includeClients, setIncludeClients] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
  
  return (
    <div className="flex  ">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {/* Main content goes here */}
        <div className="flex flex-col">
      {/* Top User Info Box */}
      <div className="flex flex-wrap  items-center text-white bg-[#071824] p-8 border-b border-gray-700  shadow">
        <p className="font-medium">USER: FTADMIN</p>
        <div className="flex flex-wrap gap-4 ml-auto text-white">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border-1 rounded-lg px-3 py-1 bg-[#1a2936] text-white"
            placeholder="From Date"
            style={{ WebkitAppearance: "none", colorScheme: "dark" }}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-1 bg-[#1a2936]"
            placeholder="To Date"
            style={{ WebkitAppearance: "none", colorScheme: "dark" }}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeClients}
              onChange={(e) => setIncludeClients(e.target.checked)}
              className="rounded"
            />
            <span>Include Broker Clients</span>
          </label>
        </div>
      </div>

      {/* Balance Info Box */}
      <div className="text-white bg-[#071824] p-8 border-b border-gray-700 shadow">
        <h2 className="text-lg font-semibold mb-4">Balance Info</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Ledger Balance</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">M2M</p>
          </div>
          <button className="ml-auto bg-[#1a2936] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Fetch Data
          </button>
        </div>
      </div>

      {/* Deposits & Withdrawals Box */}
      <div className="text-white bg-[#071824] p-8 border-b border-gray-700 shadow">
        <h2 className="text-lg font-semibold mb-4">Total Deposits & Withdrawals</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Net Deposits Withdrawals</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Sum of Deposit</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Sum of Withdrawal</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Avg Deposit</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Avg Withdrawal</p>
          </div>
          <button className="ml-auto bg-[#1a2936] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Fetch Data
          </button>
        </div>
      </div>

      {/* Client Registration Metrics */}
      <div className="text-white bg-[#071824] p-8 border-b border-gray-700 shadow">
        <h2 className="text-lg font-semibold mb-4">Clients Registration Metrics</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">New Clients Registered</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Clients Who Added Funds</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Registered & Added Funds</p>
          </div>
          <button className="ml-auto bg-[#1a2936] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Fetch Data
          </button>
        </div>
      </div>

      {/* Clients Profit & Loss */}
      <div className="text-white bg-[#071824] p-8 border-b border-gray-700 shadow">
        <h2 className="text-lg font-semibold mb-4">Clients Profit & Loss</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Avg Client Profit</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Avg Client Loss</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Profitable Clients</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Loosing Clients</p>
          </div>
          <button className="ml-auto bg-[#1a2936] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Fetch Data
          </button>
        </div>
      </div>

      {/* Positional Details */}
      <div className="text-white bg-[#071824] p-8 border-b border-gray-700 shadow">
        <h2 className="text-lg font-semibold mb-4">Positional Details</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Buy Positions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Sell Positions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-white">Buy/Sell Position Ratio</p>
          </div>
          <button className="ml-auto bg-[#1a2936] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Fetch Data
          </button>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default HomePage;