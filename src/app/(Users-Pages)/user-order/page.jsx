'use client'
import React, { useState,useEffect } from "react";

import { FaChartBar, FaShoppingCart, FaBolt, FaCog, FaChevronDown  } from "react-icons/fa";
import BottomNav from "../BotomNav";
import Cookies from "js-cookie";

const Page = () => {
    const [activeTab, setActiveTab] = useState("Open");
    const [showFunds, setShowFunds] = useState(false);
    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
      const fetchExecutedOrders = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/v1/executed-orders");
          const result = await response.json();
          if (result.success) {
            setOrders(result.orders);
          } else {
            console.error("Failed to fetch executed orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
  
      if (activeTab === "Executed" || activeTab === "Open") {
        fetchExecutedOrders();
      }
    }, [activeTab]);
      useEffect(() => {
          const storedUser = Cookies.get('userInfo');
          if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
          }
        }, []);
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-between">
      {/* Auto-running Notice */}
      <div className="bg-gray-800 text-sm text-center py-2 border-b border-gray-700 overflow-hidden whitespace-nowrap">
  <span className="inline-block animate-marquee">
    Please note that pending orders will be executed based on the prevailing bid and ask prices, not the last traded price (LTP)! May your trades be profitable and your mindset always positive!
  </span>
</div>


      {/* Orders Section */}
      <div  className="p-4  container mx-auto">
      <div className="p-4 border-b border-gray-700 container mx-auto relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Orders</h2>
          <button onClick={() => setShowFunds(!showFunds)} className="text-white focus:outline-none">
            <FaChevronDown className={`transition-transform ${showFunds ? "rotate-180" : "rotate-0"}`} />
          </button>
        </div>
        
        {showFunds && (
          <div className="p-4 bg-gray-800 border-t border-gray-700 mt-2  w-full left-0 top-0 shadow-lg">
            <h2 className="text-lg font-semibold">Funds</h2>
            <div className="flex lg:justify-between flex-col mt-2 gap-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Ledger Balance</p>
                  <p className="text-xl font-bold">
  ₹{Number(userInfo?.ledgerBalanceClose || 0).toLocaleString("en-IN")}
</p>
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
      </div>
      <div className="flex justify-between space-x-6 text-blue-400 p-4 font-semibold">
        {["Open", "Executed", "Rejected"].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 cursor-pointer ${
              activeTab === tab ? "border-b-2 border-blue-400" : "text-gray-500"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 text-white p-4 ">
      {activeTab === "Open" && (
  <div>
    {orders.length > 0 ? (
      orders.map((order) => {
        // Randomly simulate profit or loss for each order
        const randomPL = (Math.random() * 2 - 1) * order.quantity * 10; // Simulating P/L based on quantity and random fluctuation
        const plStatus = randomPL >= 0 ? "Profit" : "Loss";
        
        return (
          <div key={order.id} className="bg-gray-800 text-white p-4 rounded-lg mb-2 flex justify-between items-center">
            {/* Left Side: Order Type, Qty, Script Name */}
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${order.orderType === "BUY" ? "text-green-400" : "text-red-400"}`}>
                {order.orderType}
              </span>
              <p className="text-gray-300 text-sm">Qty: {order.quantity}</p>
              <h3 className="text-lg font-semibold">
                {order.scriptName}
              </h3>
            </div>

            {/* Right Side: Time, Status, Order Type */}
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</span>
                <span className="text-green-600 font-semibold">EXECUTED</span>
              </div>
              <span className="text-gray-400">{order.ltp}</span>
              
              <span className="text-gray-400">{order.priceType}</span>
            </div>

            {/* Display P/L */}
            {/* <div className="text-right mt-2">
              <span className={`text-lg font-bold ${plStatus === "Profit" ? "text-green-400" : "text-red-400"}`}>
                {plStatus}: {randomPL.toFixed(2)}
              </span>
            </div> */}
          </div>
        );
      })
    ) : (
      <p className="text-gray-400">No executed orders found.</p>
    )}
  </div>
)}

{activeTab === "Executed" && (
  <div>
    {orders.length > 0 ? (
      orders.map((order) => {
        // Randomly simulate profit or loss for each order
        const randomPL = (Math.random() * 2 - 1) * order.quantity * 10; // Simulating P/L based on quantity and random fluctuation
        const plStatus = randomPL >= 0 ? "Profit" : "Loss";
        
        return (
          <div key={order.id} className="bg-gray-800 text-white p-4 rounded-lg mb-2 flex justify-between items-center">
            {/* Left Side: Order Type, Qty, Script Name */}
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${order.orderType === "BUY" ? "text-green-400" : "text-red-400"}`}>
                {order.orderType}
              </span>
              <p className="text-gray-300 text-sm">Qty: {order.quantity}</p>
              <h3 className="text-lg font-semibold">
                {order.scriptName}
              </h3>
            </div>

            {/* Right Side: Time, Status, Order Type */}
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</span>
                <span className="text-green-600 font-semibold">EXECUTED</span>
              </div>
              <span className="text-gray-400">{order.ltp}</span>
              <span className={`text-lg font-bold ${plStatus === "Profit" ? "text-green-400" : "text-red-400"}`}>
                {plStatus}: {randomPL.toFixed(2)}
              </span>
              <span className="text-gray-400">{order.priceType}</span>
            </div>

            {/* Display P/L */}
            {/* <div className="text-right mt-2">
              <span className={`text-lg font-bold ${plStatus === "Profit" ? "text-green-400" : "text-red-400"}`}>
                {plStatus}: {randomPL.toFixed(2)}
              </span>
            </div> */}
          </div>
        );
      })
    ) : (
      <p className="text-gray-400">No executed orders found.</p>
    )}
  </div>
)}




        {activeTab === "Rejected" &&
        
        <p>Showing Active Orders...</p>}
      </div>
      <div className="flex-1 flex flex-col  justify-center text-center">
       
      
        <div className="flex flex-col items-center">
          <img
            src="/mnt/data/user-order.PNG"
            alt="No Pending Orders"
            className="w-32 h-32 object-contain"
          />
          <p className="text-lg font-semibold mt-4">No Pending Orders</p>
          <p className="text-sm text-gray-400">Place an order from watchlist</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav/>
    </div>
  );
};

export default Page;