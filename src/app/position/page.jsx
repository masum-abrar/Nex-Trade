// Page.js
import React from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';


const Page = () => {
  return (
    <div className="flex ">
    <div className='h-full'>
    <Sidebar />
    </div>
      <div className="flex-1">
        <Navbar />
        <div className="  bg-[#1A2C38] h-screen">
          <div className="flex justify-between mb-4 bg-[#071824] p-6 pb-4 pt-4 border-b border-gray-700 shadow">
            <div>
              <span className="text-xl font-bold text-white">User: FTADMIN</span>
            </div>
            <div>
              <span className="text-sm text-white">Open PNL: 0</span>
              <span className="ml-4 text-sm text-white">Current Week PNL: 0</span>
            </div>
          </div>

          <div className="space-y-4 p-6 ">
            <div className="flex space-x-4">
              <button className=" px-4 py-2 rounded-lg text-white bg-gray-700">User Combine Position</button>
              <button className=" px-4 py-2 rounded-lg text-white bg-gray-700">Open Position</button>
              <button className=" px-4 py-2 rounded-lg text-white bg-gray-700">Active Trades</button>
              <button className=" px-4 py-2 rounded-lg text-white bg-gray-700">Close Position</button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search for Userid or Script"
                className="p-2 mt-2 w-full bg-gray-200 rounded"
              />
            </div>

            <div className="mt-4">
              <div className='text-white'>No Open Position available.</div>
              <div className="flex justify-between items-center text-white mt-4">
                <span>Page 1 of 0</span>
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-gray-700 text-white rounded" disabled>Previous</button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
