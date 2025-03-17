'use client'
import Navbar from '@/app/Components/Navbar';
import Sidebar from '@/app/Components/Sidebar';
import React, { useState } from 'react';

const ToggleSwitch = ({ label }) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center justify-between w-full max-w-xs">
      <span className="text-gray-300 text-sm">{label}</span>
      <button
        className={`relative w-12 h-6 flex items-center bg-gray-800 rounded-full p-1 transition ${
          enabled ? 'bg-indigo-600' : 'bg-gray-700'
        }`}
        onClick={() => setEnabled(!enabled)}
      >
        <div
          className={`w-4 h-4 bg-gray-300 rounded-full shadow-md transform transition ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </button>
    </div>
  );
};

const Page = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">New User Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">LOGIN USRID</label>
                <input
                  type="text"
                  value="CRP217"
                  className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  readOnly
                />
                <p className="mt-1 text-sm text-green-400">User ID is available.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 ">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Role</label>
                <select className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>User</option>
                  <option>Sub-Broker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Margin Type</label>
                <select className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>Credit</option>
                  <option>Exposure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Segment Allow</label>
                <span className='text-xs text-gray-400'>Select the segment you want to allow user</span>
                <select className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>NSE</option>
                  <option>MCX</option>
                  <option>CRYPTO</option>
                  <option>FOREX</option>
                </select>
              </div>
              <div>
                <button className='w-full bg-gray-800 py-2 px-4 rounded'>Add</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Intraday Square</label>
                <span className='text-xs text-gray-400'>Making it "true" will close user's position at 3:29PM at bid/ask
                </span>
                <select className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>True</option>
                  <option>False</option>
                  
                </select>
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-300">
    Ledger Balance Close (%) (ninety)
  </label>
  <span className="text-xs text-gray-400">
    Input in %, e.g., 90. The system will close all user's positions when the loss reaches 90% of the user's ledger balance.
  </span>
  <input
    type="number"
    min="0"
    max="100"
    placeholder="90"
    className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-300">
  Profit Trade Hold Min Seconds ( ninety )
  </label>
  <input
    type="number"
    min="0"
    max="100"
    placeholder="0"
    className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-300">
  Loss Trade Hold Min Seconds ( ninety )
  </label>
  <input
    type="number"
    min="0"
    max="100"
    placeholder="Ledger Blance Close"
    className="mt-1 p-4 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>
<div className="flex flex-col space-y-2">
  {[
    "Show MCX",
    "Show MCXOPTBUY",
    "Show MCXOPTSELL",
    "Show MCXOPT",
    "Show NSE",
    "Show IDXNSE",
    "Show IDXOPTBUY",
    "Show IDXOPTSELL",
    "Show IDXOPT",
    "Show STKOPTBUY",
    "Show STKOPTSELL",
    "Show STKOPT",
    "Show STKNSE",
    "Show STKEQ",
    "Show BSEOPTBUY",
    "Show BSEOPTSELL",
    "Show BSEOPT",
    "Show IDXBSE",
    "Show CRYPTO",
    "Show FOREX",
    "Show COMEX",
    "Show GLOBALINDEX",
    "Submit",
  ].map((text) => (
    <button
      key={text}
      className="w-[50%] bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
    >
      {text}
    </button>
  ))}
</div>



            </div>
            
            {/* Right Column with Toggle Switches */}
            <div className="space-y-4">
              {[
                'Activation',
                'Read Only',
                'Demo',
                'Intraday Square',
                'Block Limit Above/Below High Low',
                'Block Limit Between High Low',
              ].map((label) => (
                <ToggleSwitch key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;