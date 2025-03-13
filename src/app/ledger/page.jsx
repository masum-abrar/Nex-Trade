'use client'
import React from 'react';
import Navbar from '../components/Navbar';
const ActionLogsTable = () => {
  return (
    <div className="p-6">
      <div className=" p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Action Logs</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input type="date" placeholder="From Date" className="p-2 rounded bg-gray-700 text-white" />
          <input type="date" placeholder="To Date" className="p-2 rounded bg-gray-700 text-white" />
          <button className="px-4 py-2 bg-gray-700 rounded-md text-white ">Fetch Date</button>
          <button className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600">Export Excel</button>
          <select className="p-2 rounded bg-gray-700 text-white">
            <option value="">Select an option</option>
            <option value="MW">Manual Withdrawal</option>
            <option value="RW">Auto Withdrawal</option>
            <option value="MD">Manual Deposit</option>
            <option value="RD">Auto Deposit</option>
          </select>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 mb-4 rounded-md border border-gray-400 bg-[#1A2C38] text-white placeholder-gray-300"
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-gray-200">
                <th className="p-3">Date</th>
                <th className="p-3">UserID</th>
                <th className="p-3">By</th>
                <th className="p-3">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr className=" hover:bg-gray-500 transition duration-200 text-center">
                <td className="p-3">20/02/25 Thu, 05:05:38 PM</td>
                <td className="p-3">FTDEMO</td>
                <td className="p-3">FTDEMO</td>
                <td className="p-3">Stop Order Execution: FALCON TRADER DEMO(FTDEMO) buy 2500 Qty Of COPPER25FEBFUT At 870.98</td>
              </tr>
              {/* <tr className="bg-gray-600 hover:bg-gray-500 transition duration-200 text-center">
                <td className="p-3">20/02/25 Thu, 04:54:32 PM</td>
                <td className="p-3">FTDEMO</td>
                <td className="p-3">FTDEMO</td>
                <td className="p-3">Order Execution: FALCON TRADER DEMO(FTDEMO) buy 2500 Qty Of COPPER25FEBFUT At 871.57</td>
              </tr> */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-6">
      <span className="text-gray-300">Page 1</span>
      <div>
        <button className="px-4 py-2 bg-gray-600 rounded-md text-gray-300 cursor-not-allowed" disabled>
          Previous
        </button>
        <button className="ml-3 px-4 py-2 bg-gray-700 rounded-md text-white ">
          Next
        </button>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#071824] text-white">
      <Navbar />
   
      <ActionLogsTable />
    </div>
  );
};

export default Page;
