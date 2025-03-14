'use client';
import React from 'react';
import Navbar from '../Components/Navbar';
const marketDatas = [
    {
      name: 'AARTIIND',
      date: '27 MAR',
      qty: 0,
      bid: 389.25,
      ask: 389.8,
      ltp: 389.8,
      change: '-3.35 (-0.85)',
      color: 'text-green-400',
    },
    {
      name: 'BANKNIFTY',
      date: '27 MAR',
      qty: 0,
      bid: 48179.85,
      ask: 48192.05,
      ltp: 48192.1,
      change: '-21.85 (-0.05)',
      color: 'text-green-400',
    },
    {
      name: 'NIFTY',
      date: '27 MAR',
      qty: 0,
      bid: 22509.95,
      ask: 22512.7,
      ltp: 22507.4,
      change: '-22.95 (-0.10)',
      color: 'text-red-400',
    },
  ];
  
const marketData = [
    {
      script: 'AARTIIND 27 MAR',
      bid: 393.4,
      ask: 394,
      ltp: 393.45,
      ch: -0.80,
      chp: -0.20,
      high: 398.65,
      low: 385.5,
      open: 398.55,
      close: 394.25,
      time: '04:45:24 pm',
    },
    {
      script: 'BANKNIFTY 27 MAR',
      bid: 48215,
      ask: 48232.25,
      ltp: 48215,
      ch: 215.75,
      chp: 0.45,
      high: 48330,
      low: 47939.7,
      open: 48055.05,
      close: 47999.5,
      time: '04:46:57 pm',
    },
    {
      script: 'NIFTY 27 MAR',
      bid: 22520.05,
      ask: 22526.95,
      ltp: 22527,
      ch: -37.35,
      chp: -0.17,
      high: 22618.8,
      low: 22380.2,
      open: 22580,
      close: 22564.3,
      time: '04:45:24 pm',
    },
  ];

const MarketPage = () => {
  return (
    <div className="min-h-screen bg-[#071824] text-white">
      <Navbar />

      {/* Menu */}
      <div className="flex space-x-4 overflow-x-auto p-4 mt-6">
      {['NSEFUT', 'NSEOPT', 'MCXFUT', 'MCXOPT', 'NSE-EQ', 'BSE-FUT', 'BSE-OPT', 'CRYPTO', 'FOREX', 'COMEX', 'GLOBALINDEX'].map((item, index) => (
          <a
            key={index}
            href="#"
            className={`px-4 py-2 ${index === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'} hover:text-white`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-3 flex items-center space-x-3 bg-[#213743] m-4 rounded-sm">
        <img className="w-6 h-6" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png" alt="search" />
        <a href="#" className="text-white hover:underline text-sm">
          Search & Add New Symbols
        </a>
      </div>

      {/* Table & Cards */}
      <div className="p-4 pt-0">
        {/* Desktop Table */}
        <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#213743] text-white text-sm">
              <th className="p-4 rounded-l-xl">Script</th>
              <th className="p-2">Bid</th>
              <th className="p-4">Ask</th>
              <th className="p-4">Ltp</th>
              <th className="p-4">Ch</th>
              <th className="p-4">Chp</th>
              <th className="p-4">High</th>
              <th className="p-4">Low</th>
              <th className="p-4">Open</th>
              <th className="p-4">Close</th>
              <th className="p-4 rounded-r-xl">Time</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((data, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-4 text-white">{data.script}</td>
                <td className={`p-4 ${data.bid > data.ask ? 'text-green-400' : 'text-red-400'}`}>{data.bid}</td>
                <td className={`p-4 ${data.ask > data.bid ? 'text-red-400' : 'text-green-400'}`}>{data.ask}</td>
                <td className="p-4 text-white">{data.ltp}</td>
                <td className={`p-4 ${data.ch < 0 ? 'text-red-400' : 'text-green-400'}`}>{data.ch}</td>
                <td className={`p-4 ${data.chp < 0 ? 'text-red-400' : 'text-green-400'}`}>{data.chp}</td>
                <td className="p-4 text-white">{data.high}</td>
                <td className="p-4 text-white">{data.low}</td>
                <td className="p-4 text-white">{data.open}</td>
                <td className="p-4 text-white">{data.close}</td>
                <td className="p-4 text-gray-400">{data.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Mobile View  */}
        <div className="md:hidden space-y-4">
          {marketDatas.map((data, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded-lg bg-gray-800">
              <div className="flex justify-between">
                <p className="text-lg font-bold">{data.name}</p>
                <p className="text-sm text-gray-400">Qty: {data.qty}</p>
              </div>
             
              <div className="flex justify-between mt-2">
                <p className="text-lg">LTP: <span className={data.color}>{data.ltp}</span></p>
                <p className={data.color}>{data.change}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MarketPage;
