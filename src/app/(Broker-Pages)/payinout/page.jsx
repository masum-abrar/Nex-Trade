'use client'
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";

const LedgerRequests = () => {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await fetch("https://nex-trade-backend.vercel.app/api/v1/deposites");
        const data = await response.json();
        setDeposits(data);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      }
    };

    fetchDeposits();
  }, []);

  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />

      <div className="container max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Ledger Requests
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Deposits
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-green-700">
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
                  <th key={index} className="p-3">{heading}</th>
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
                    <td className="p-3">{deposit.depositType}</td>
                    <td className="p-3">{deposit.depositAmount || "N/A"}</td>
                    <td className="p-3">Pending</td>
                    <td className="p-3">N/A</td>
                    <td className="p-3">
                      {deposit.depositImage ? (
                        <a
                          href={deposit.depositImage}
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
                    {/* Action Buttons */}
                    <td className="p-3">
                      <button className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600">
                        Accept
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600">
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
                    No Deposits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 shadow-md rounded-md bg-gray-900">
          <span>Page 1 of 1</span>
          <div>
            <button className="bg-gray-400 text-white px-3 py-1 rounded-md mr-2" disabled>
              Previous
            </button>
            <button className="bg-gray-400 text-white px-3 py-1 rounded-md" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerRequests;
