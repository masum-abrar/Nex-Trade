'use client';
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const LedgerRequests = () => {
  const [deposits, setDeposits] = useState([]);
  const [activeTab, setActiveTab] = useState("deposit");

const router = useRouter();

 useEffect(() => {
      const userInfo = Cookies.get('userInfo');
    
      if (!userInfo) {
        router.push('/login');
      } else {
        const user = JSON.parse(userInfo);
    
        if (!user.userId || (user.role !== 'Broker' && user.role !== 'Admin')) {
          router.replace('/unauthorized'); 
        }
      }
    }, []);




  useEffect(() => {
    const fetchData = async () => {
      const url =
        activeTab === "deposit"
          ? "https://nex-trade-backend.vercel.app/api/v1/deposites"
          : "https://nex-trade-backend.vercel.app/api/v1/withdraws";

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Only set status to Pending if it's missing
        const withStatus = data.map((item) => ({
          ...item,
          status: item.status || "Pending",
        }));

        setDeposits(withStatus);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleStatusChange = async (id, newStatus) => {
    const endpoint =
      activeTab === "deposit"
        ? `https://nex-trade-backend.vercel.app/api/v1/update-deposites/${id}/status`
        : `https://nex-trade-backend.vercel.app/api/v1/update-withdraws/${id}/status`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = deposits.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        setDeposits(updated);

        if (newStatus === "Accepted") {
          toast.success("Request Accepted ✅");
        } else {
          toast.error("Request Rejected ❌");
        }
      } else {
        toast.error("Failed to update status ❌");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Ledger Requests
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "deposit"
                ? "bg-blue-700 text-white"
                : "bg-gray-700 text-white hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab("deposit")}
          >
            Deposits
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "withdraw"
                ? "bg-green-700 text-white"
                : "bg-gray-700 text-white hover:bg-green-600"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            Withdrawals
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Update Bank Details
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                {[
                  "Date",
                  "Broker",
                  "Sub Broker",
                  "User ID",
                  "Type",
                  "Amount",
                  "Status",
                  "Remark",
                  "Image",
                  "Accept",
                  "Reject",
                  "Positions",
                  "Ledger",
                  "Delete",
                ].map((heading, index) => (
                  <th key={index} className="p-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deposits.length > 0 ? (
                deposits.map((deposit, index) => (
                  <tr key={index} className="border-b bg-gray-900 text-center">
                    <td className="p-3">{deposit.createdAt || "N/A"}</td>
                    <td className="p-3">zyan</td>
                    <td className="p-3">masum</td>
                    <td className="p-3">{deposit.loginUserId || "N/A"}</td>
                    <td className="p-3">
                      {deposit.depositType || deposit.type}
                    </td>
                    <td className="p-3">
                      {deposit.depositAmount || deposit.amount || "N/A"}
                    </td>

                    <td className="p-3">{deposit.status}</td>
                    <td className="p-3">N/A</td>
                    <td className="p-3">
                      {deposit.depositImage || deposit.withdrawImage ? (
                        <a
                          href={deposit.depositImage || deposit.withdrawImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* Accept Button */}
                    <td className="p-3">
                      <button
                        className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600 disabled:opacity-50"
                        onClick={() =>
                          handleStatusChange(deposit.id, "Accepted")
                        }
                        disabled={deposit.status !== "Pending"}
                      >
                        Accept
                      </button>
                    </td>

                    {/* Reject Button */}
                    <td className="p-3">
                      <button
                        className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 disabled:opacity-50"
                        onClick={() =>
                          handleStatusChange(deposit.id, "Rejected")
                        }
                        disabled={deposit.status !== "Pending"}
                      >
                        Reject
                      </button>
                    </td>

                    <td className="p-3">
                      <button className="bg-purple-500 px-3 py-1 rounded text-white hover:bg-purple-600">
                        Positions
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600">
                        Ledger
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="14"
                    className="text-center text-lg p-6 text-white border-b bg-gray-900"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerRequests;
