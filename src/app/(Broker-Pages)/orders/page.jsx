'use client'

import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("executed");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === "executed" 
          ? "http://localhost:4000/api/v1/executed-orders"
          : "http://localhost:4000/api/v1/limit-orders";
        
        const response = await fetch(endpoint);
        const result = await response.json();
        if (result.success) {
          setOrders(result.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [activeTab]);

  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/delete-order/${orderId}`, {
        method: "DELETE",
      });
  
      const result = await response.json();
      console.log(result);  // Check the result here
  
      if (result.success) {
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="bg-[#071824] h-screen">
          <div className="executed-orders-broker">
            <div className="lot-qty1 flex justify-between items-center bg-[#071824] p-8 border-b border-gray-700 shadow">
              <div className="lot-qty2 flex space-x-2">
                <button onClick={() => setActiveTab("executed")} className={`px-4 py-2 rounded-lg ${activeTab === "executed" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>Executed Orders</button>
                <button onClick={() => setActiveTab("limit")} className={`px-4 py-2 rounded-lg ${activeTab === "limit" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>Limit Orders</button>
                <button onClick={() => setActiveTab("rejected")} className={`px-4 py-2 rounded-lg ${activeTab === "rejected" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>Rejected Orders</button>
              </div>
            </div>
            
            <div className="top-headline-e mt-4 text-lg font-semibold text-white p-8 pt-0 pb-0">
              {activeTab === "executed" ? "Executed Orders" : activeTab === "limit" ? "Limit Orders" : "Rejected Orders"}
            </div>
            
            {loading ? (
              <div className="text-white mt-4 p-8">Loading...</div>
            ) : orders.length > 0 ? (
              <div className="p-8">
                <input type="text" placeholder="Search In Table" className="border px-2 py-1 w-full rounded bg-gray-700 text-white" />
                <div className="text-white mt-4 overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-700">UserID</th>
                        <th className="py-2 px-4 border-b border-gray-700">Time</th>
                        <th className="py-2 px-4 border-b border-gray-700">Info</th>
                        <th className="py-2 px-4 border-b border-gray-700">Type</th>
                        <th className="py-2 px-4 border-b border-gray-700">Script</th>
                        <th className="py-2 px-4 border-b border-gray-700">Quantity</th>
                        <th className="py-2 px-4 border-b border-gray-700">Average Price</th>
                        <th className="py-2 px-4 border-b border-gray-700">Trade IP</th>
                        {activeTab === "limit" && <th className="py-2 px-4 border-b border-gray-700">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.userId || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.createdAt || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.priceType || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.orderType || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.scriptName || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.quantity || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.ltq || 'N/A'}</td>
                          <td className="py-2 px-4 border-b border-gray-700 text-xs">{order.tradeIp || 'N/A'}</td>
                          {activeTab === "limit" && (
                            <td className="py-2 px-4 border-b border-gray-700 text-xs">
                              <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-white mt-4 p-8">No data available.</div>
            )}
          </div>
        </div>
      </div>
       <ToastContainer />
    </div>
  );
};

export default OrdersPage;
