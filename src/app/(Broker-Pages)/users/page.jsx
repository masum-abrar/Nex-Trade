

import React from 'react';
import Navbar from '../Components/Navbar';


const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#071824] text-white">
     <Navbar/>
      
      {/* Stats Section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg text-center shadow-md">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center shadow-md">
          <h3 className="text-lg font-semibold">Demo Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center shadow-md">
          <h3 className="text-lg font-semibold">Net Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6">
        <div className=" p-6 rounded-lg shadow-md overflow-x-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 rounded-md border border-gray-400 bg-[#1A2C38] text-white placeholder-gray-300 mb-4"
          />
          
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-gray-800 text-gray-200">
                  <th className="p-3">Position</th>
                  <th className="p-3">UserID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Ledger Bal</th>
                  <th className="p-3">Open PNL</th>
                  <th className="p-3">M2M</th>
                  <th className="p-3">Ledger</th>
                  <th className="p-3">Margin Used</th>
                  <th className="p-3">Holding Margin</th>
                  <th className="p-3">Margin Available</th>
                  <th className="p-3">Weekly Closed PNL</th>
                  <th className="p-3">All Time Closed PNL</th>
                  <th className="p-3">Sub-Broker</th>
                  <th className="p-3">Broker</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">SL</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Demo</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Created On</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                <tr className=" hover:bg-gray-500 transition duration-200 text-center">
                  <td className="p-3"><button className="bg-blue-500 px-3 py-1 rounded">P</button></td>
                  <td className="p-3">PAWAN234</td>
                  <td className="p-3">Pawan</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3">0</td>
                  <td className="p-3"></td>
                  <td className="p-3">FTADMIN</td>
                  <td className="p-3">ADMIN@FALCON</td>
                  <td className="p-3">Exposure</td>
                  <td className="p-3">90%</td>
                  <td className="p-3"></td>
                  <td className="p-3">NO</td>
                  <td className="p-3">YES</td>
                  <td className="p-3">19/02/25</td>
                  <td className="p-3">
                    <button className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600">
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-gray-300">Page 1 of 3</span>
            <div>
              <button className="px-4 py-2 bg-gray-600 rounded-md text-gray-300 cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="ml-3 px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
