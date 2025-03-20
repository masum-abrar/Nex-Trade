"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../../Components/Navbar";

const MarketPage = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("BSE-FUT");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [liveData, setLiveData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/Book1.xlsx");
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

  useEffect(() => {
    if (Object.keys(subscriptions).length === 0) return;

    setIsLoading(true);
    const wsUrl = `wss://api-feed.dhan.co?version=2&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzQzNzA1MjkyLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly92ZWRhbnRhdHJhZGUuY29tLyIsImRoYW5DbGllbnRJZCI6IjExMDAyNzk5NzQifQ.8XpKqQjU7s5KaV3ONp_eW9S8OBZwb4uKXfFyTm8EWJVR8YMUB6029XZPx712RgFk7QCEl8AEoDWxmWp-KSCwcg&clientId=1100279974&authType=2`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected successfully.");
    
      if (!Object.keys(subscriptions).length) {
        console.warn(" No subscriptions found. Make sure instruments are selected.");
        return;
      }
    
      Object.entries(subscriptions).forEach(([securityId, details]) => {
        if (details.isChecked) {
          console.log(` Subscribing to: Security ID ${securityId}, Exchange Segment: ${details.exchangeSegment}`);
          subscribe(securityId, ws);
        } else {
          console.log(` Security ID ${securityId} is not checked. Skipping subscription.`);
        }
      });
    };
    

    ws.onmessage = async (event) => {
      console.log("Raw WebSocket message:", event.data);
      console.log("Type of received data:", typeof event.data);
    
      if (event.data instanceof Blob) {
        const buffer = await event.data.arrayBuffer();
        const binaryData = new Uint8Array(buffer);
        console.log("Binary Data Received:", binaryData);
        decodeBinaryData(binaryData);
      } else if (event.data instanceof ArrayBuffer) {
        const binaryData = new Uint8Array(event.data);
        console.log("Binary Data Received:", binaryData);
        decodeBinaryData(binaryData);
      } else {
        console.warn("Unexpected data format received.");
      }
    };
    
    
    
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsLoading(false);
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => {
      ws.close();
      setIsLoading(false);
    };
  }, [subscriptions]);

  const subscribe = (securityId, ws) => {
    const instrument = data.find((item) => item.SEM_SMST_SECURITY_ID === parseInt(securityId));
    if (!instrument) {
      console.error("Instrument not found for ID:", securityId);
      return;
    }
  
    const mappedSegment = instrument.SEM_EXM_EXCH_ID === "NSE" ? "NSE_FNO" : instrument.SEM_EXM_EXCH_ID === "BSE" ? "BSE_FNO" : instrument.SEM_EXM_EXCH_ID;
  
    const subscribeMessage = JSON.stringify({
      RequestCode: 15,
      InstrumentCount: 1,
      InstrumentList: [
        {
          ExchangeSegment: mappedSegment,
          SecurityId: securityId,
        },
      ],
    });
  
    console.log("Sending WebSocket subscription request:", subscribeMessage);
    ws.send(subscribeMessage);
  };
  

  function decodeBinaryData(uint8Array) {
    const dataView = new DataView(uint8Array.buffer);
    let offset = 0;
  
    console.log('Received data length:', uint8Array.length);
  
    let ltp = null,
      ltq = null,
      ltt = null,
      averagePrice = null,
      volume = null,
      totalSellQuantity = null,
      totalBuyQuantity = null,
      dayOpenValue = null,
      dayCloseValue = null,
      dayHighValue = null,
      dayLowValue = null;
  
    try {
      // 0-8: Response Header (array of 8 bytes) - Skip for now
      offset += 8;
  
      // 9-12: float32 Latest Traded Price (LTP)
      if (uint8Array.length >= 12) {
        ltp = dataView.getFloat32(offset, true);
        console.log('LTP:', ltp);
        offset += 4;
      }
  
      // 13-14: int16 Last Traded Quantity (LTQ)
      if (uint8Array.length >= 14) {
        ltq = dataView.getInt16(offset, true);
        console.log('LTQ:', ltq);
        offset += 2;
      }
  
      // 15-18: int32 Last Trade Time (LTT)
      if (uint8Array.length >= 18) {
        ltt = dataView.getInt32(offset, true);
        console.log('LTT (raw):', ltt);
        offset += 4;
      }
  
      // 19-22: float32 Average Trade Price (ATP)
      if (uint8Array.length >= 22) {
        averagePrice = dataView.getFloat32(offset, true);
        console.log('Average Trade Price (ATP):', averagePrice);
        offset += 4;
      }
  
      // 23-26: int32 Volume
      if (uint8Array.length >= 26) {
        volume = dataView.getInt32(offset, true);
        console.log('Volume:', volume);
        offset += 4;
      }
  
      // 27-30: int32 Total Sell Quantity
      if (uint8Array.length >= 30) {
        totalSellQuantity = dataView.getInt32(offset, true);
        console.log('Total Sell Quantity:', totalSellQuantity);
        offset += 4;
      }
  
      // 31-34: int32 Total Buy Quantity
      if (uint8Array.length >= 34) {
        totalBuyQuantity = dataView.getInt32(offset, true);
        console.log('Total Buy Quantity:', totalBuyQuantity);
        offset += 4;
      }
  
      // 35-38: float32 Day Open Value
      if (uint8Array.length >= 38) {
        dayOpenValue = dataView.getFloat32(offset, true);
        console.log('Day Open Value:', dayOpenValue);
        offset += 4;
      }
  
      // 39-42: float32 Day Close Value
      if (uint8Array.length >= 42) {
        dayCloseValue = dataView.getFloat32(offset, true);
        console.log('Day Close Value:', dayCloseValue);
        offset += 4;
      }
  
      // 43-46: float32 Day High Value
      if (uint8Array.length >= 46) {
        dayHighValue = dataView.getFloat32(offset, true);
        console.log('Day High Value:', dayHighValue);
        offset += 4;
      }
  
      // 47-50: float32 Day Low Value
      if (uint8Array.length >= 50) {
        dayLowValue = dataView.getFloat32(offset, true);
        console.log('Day Low Value:', dayLowValue);
        offset += 4;
      }
  
      return {
        ltp,
        ltq,
        ltt,
        averagePrice,
        volume,
        totalSellQuantity,
        totalBuyQuantity,
        dayOpenValue,
        dayCloseValue,
        dayHighValue,
        dayLowValue,
      };
    } catch (error) {
      console.error('Error decoding binary data:', error);
      return { error: 'Decoding error' };
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = data.filter((row) => {
      const instrumentName = row?.SEM_INSTRUMENT_NAME?.toUpperCase();
      const customSymbol = row?.SEM_CUSTOM_SYMBOL?.toUpperCase();
      const searchText = searchTerm.toUpperCase();

      if (activeTab === "BSE-OPT" && instrumentName.includes("OPT")) {
        return customSymbol.includes(searchText);
      }

      if (activeTab === "BSE-FUT" && instrumentName.includes("FUT")) {
        return customSymbol.includes(searchText);
      }

      if (activeTab === "NSEFUT" && instrumentName.includes("OPT")) {
        return customSymbol.includes(searchText);
      }

      return false;
    });

    setSearchResults(filtered);
  }, [searchTerm, data, activeTab]);

  const handleCheckboxChange = (securityId, exchangeSegment) => {
    const mappedSegment = exchangeSegment === "NSE" ? "NSE_FNO" : exchangeSegment === "BSE" ? "BSE_FNO" : exchangeSegment;
  
    console.log("Selected ID:", securityId);
    console.log("Mapped Exchange Segment:", mappedSegment);
  
    const isChecked = !subscriptions[securityId]?.isChecked;
    setSubscriptions({
      ...subscriptions,
      [securityId]: { isChecked, exchangeSegment: mappedSegment },
    });
  
    if (isChecked) {
      console.log("Attempting to subscribe with:", {
        ExchangeSegment: mappedSegment,
        SecurityId: securityId,
      });
    } else {
      console.log("Unsubscribing:", securityId);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />
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
      <div className="p-3 flex items-center space-x-3 bg-[#213743] m-4 rounded-sm cursor-pointer">
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
        />
      </div>
      <div className="p-4">
        {searchResults.length > 0 && (
          <ul className="bg-gray-800 p-2 rounded-md">
            {searchResults.map((item) => (
              <li key={item.SEM_SMST_SECURITY_ID} className="flex justify-between items-center p-2 border-b border-gray-600">
                <span>{item.SEM_TRADING_SYMBOL}</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={subscriptions[item.SEM_SMST_SECURITY_ID]?.isChecked || false}
                    onChange={() => handleCheckboxChange(item.SEM_SMST_SECURITY_ID, item.SEM_EXM_EXCH_ID)}
                    className="w-4 h-4"
                  />
                  <span>Future</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4">
        {isLoading ? (
          <p>Loading live data...</p> // Show loading text or a spinner
        ) : (
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2">LTP</th>
                <th className="border p-2">LTQ</th>
                <th className="border p-2">LTT</th>
                <th className="border p-2">Avg Price</th>
                <th className="border p-2">Total Sell Qty</th>
                <th className="border p-2">Total Buy Qty</th>
                <th className="border p-2">Open</th>
                <th className="border p-2">Close</th>
                <th className="border p-2">High</th>
                <th className="border p-2">Low</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border">
                <td className="border p-2">{liveData.ltp || "N/A"}</td>
                <td className="border p-2">{liveData.ltq || "N/A"}</td>
                <td className="border p-2">{liveData.ltt || "N/A"}</td>
                <td className="border p-2">{liveData.averagePrice || "N/A"}</td>
                <td className="border p-2">{liveData.totalSellQuantity || "N/A"}</td>
                <td className="border p-2">{liveData.totalBuyQuantity || "N/A"}</td>
                <td className="border p-2">{liveData.dayOpenValue || "N/A"}</td>
                <td className="border p-2">{liveData.dayCloseValue || "N/A"}</td>
                <td className="border p-2">{liveData.dayHighValue || "N/A"}</td>
                <td className="border p-2">{liveData.dayLowValue || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
