"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../../Components/Navbar";

const MarketPage = () => {
  const [data, setData] = useState([]); // Original data from Excel
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // Store selected items

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api-scrip-master-one.xlsx"); // Fetch from public folder
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

  // Filter data based on search input
  const filteredData = searchTerm
    ? data.filter((row) =>
        row.SEM_EXM_EXCH_ID?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle checkbox toggle
  const handleCheckboxToggle = (selectedRow) => {
    setSelectedItems((prevSelected) => {
      // Check if the row is already selected
      const isAlreadySelected = prevSelected.some(
        (item) => item.SEM_EXM_EXCH_ID === selectedRow.SEM_EXM_EXCH_ID
      );

      if (isAlreadySelected) {
        // Remove item if already selected
        return prevSelected.filter((item) => item.SEM_EXM_EXCH_ID !== selectedRow.SEM_EXM_EXCH_ID);
      } else {
        // Add item if not selected
        return [...prevSelected, selectedRow];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />

      {/* Menu */}
      <div className="flex space-x-4 overflow-x-auto p-4 mt-6">
        {[
          "NSEFUT",
          "NSEOPT",
          "MCXFUT",
          "MCXOPT",
          "NSE-EQ",
          "BSE-FUT",
          "BSE-OPT",
          "CRYPTO",
          "FOREX",
          "COMEX",
          "GLOBALINDEX",
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className={`px-4 py-2 ${
              index === 0 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"
            } hover:text-white`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Search Bar */}
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

      {/* Search Results with Checkboxes */}
      {showSearchResults && searchTerm && (
        <div className="p-4 bg-[#1A2C38] rounded-md mx-4">
          {filteredData.length > 0 ? (
            <ul className="space-y-2">
              {filteredData.map((row, i) => (
                <li key={i} className="flex items-center justify-between p-2 border-b border-gray-600">
                  <span>{row.SEM_EXM_EXCH_ID || "N/A"}</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedItems.some((item) => item.SEM_EXM_EXCH_ID === row.SEM_EXM_EXCH_ID)}
                    onChange={() => handleCheckboxToggle(row)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No results found</p>
          )}
        </div>
      )}

      {/* Table Showing Only Selected Items */}
      <div className="p-4">
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2">Exchange ID</th>
              <th className="border p-2">Security ID</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.length > 0 ? (
              selectedItems.map((row, i) => (
                <tr key={i} className="border">
                  <td className="border p-2">{row.SEM_EXM_EXCH_ID || "N/A"}</td>
                  <td className="border p-2">{row.SEM_SMST_SECURITY_ID || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-2 text-gray-400">
                  No selected items
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
