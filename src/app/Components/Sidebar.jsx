'use client';

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 text-white"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static w-64 bg-[#071824] text-white  flex flex-col transition-transform duration-300 ease-in-out z-40 border-r-2  border-gray-500`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">FTROHIT</h2>
            <span className="text-sm text-gray-400">Broker</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name"
              className="w-full bg-[#1a2936] text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span>Rohit broker</span>
              <span className="text-sm text-gray-400">FTROHIT</span>
            </div>
            <span className="text-sm text-gray-400">Broker</span>
          </div>
        </div>

        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <Link href="/create-user" className="text-sm hover:text-blue-400">
            Create New User
          </Link>
          <button className="text-sm bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors">
            Add
          </button>
        </div>

        <div className="p-4 mt-auto border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm">Page 1</span>
            <div className="flex space-x-2">
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Previous
              </button>
              <button className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;