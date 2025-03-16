"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../../Components/Navbar";

const MarketPage = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("NSEFUT");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api-scrip-master.xlsx");
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        setData(jsonData);
      };

      reader.readAsArrayBuffer(blob);
    };

    fetchData();
  }, []);

  // Function to filter data based on active tab
  const getFilteredData = () => {
    return data.filter((row) => {
      const exchangeId = row?.SEM_EXM_EXCH_ID?.trim()?.toUpperCase();
      const instrumentType = row?.SEM_EXCH_INSTRUMENT_TYPE?.trim()?.toUpperCase();
  
      switch (activeTab) {
        case "NSEFUT":
          return exchangeId === "NSE" && instrumentType.includes("FUT");
        case "NSEOPT":
          return exchangeId === "NSE" && instrumentType.includes("OPT");
        case "MCXFUT":
          return exchangeId === "MCX" && instrumentType.includes("FUT");
        case "MCXOPT":
          return exchangeId === "MCX" && instrumentType.includes("OPT");
        case "BSE-FUT":
          return exchangeId === "BSE" && instrumentType.includes("FUT");
        case "BSE-OPT":
          return exchangeId === "BSE" && instrumentType.includes("OPT");
        default:
          return false;
      }
    });
  };
  
  

  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />

      {/* Tabs */}
      <div className="flex space-x-4 overflow-x-auto p-4 mt-6 border-b border-gray-600">
        {["NSEFUT", "NSEOPT", "MCXFUT", "MCXOPT", "BSE-FUT", "BSE-OPT"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === item ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"
            } hover:text-white`}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        className="p-3 flex items-center space-x-3 bg-[#213743] m-4 rounded-sm cursor-pointer"
        onClick={() => setShowSearchResults(true)}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png"
          alt="search"
        />
        <input
          type="text"
          placeholder="Search & Add New Symbols"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md bg-[#1A2C38] text-white placeholder-gray-400"
          autoFocus
        />
      </div>
      {/* Data Table */}
      <div className="p-4">
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2">Exchange ID</th>
              <th className="border p-2">Security ID</th>
              <th className="border p-2">SEM EXCH INSTRUMENT TYPE</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData().length > 0 ? (
              getFilteredData().map((row, i) => (
                <tr key={i} className="border">
                  <td className="border p-2">{row.SEM_EXM_EXCH_ID || "N/A"}</td>
                  <td className="border p-2">{row.SEM_SMST_SECURITY_ID || "N/A"}</td>
                  <td className="border p-2">{row.SEM_INSTRUMENT_NAME || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-2 text-gray-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPage;
