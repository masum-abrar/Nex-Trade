"use client";
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { FaTrash, FaPlus, FaChartBar, FaShoppingCart, FaBolt, FaCog } from "react-icons/fa";
import BottomNav from "../BotomNav";

const MarketWatch = () => {
  const [search, setSearch] = useState("");
  const [info, setData] = useState([])
  const [activeTab, setActiveTab] = useState('BSE-FUT')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [subscriptions, setSubscriptions] = useState({})
  const [liveData, setLiveData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [isBrokerage, setIsBrokerage] = useState(false);
  const [isStopLossTarget, setIsStopLossTarget] = useState(false);
  const [orderLots, setOrderLots] = useState(1);
const lotSize = 30;
const calculatedQty = orderLots * lotSize;



  const handleRowClick = (dataPoint) => {
    setSelectedDataPoint(dataPoint);
  };

  const closeModal = () => {
    setSelectedDataPoint(null);
  };
  const handleOrder = async (orderType) => {
  const orderData = {
    scriptName: info.find(item => item.SEM_SMST_SECURITY_ID === parseInt(selectedDataPoint?.securityId))?.SEM_TRADING_SYMBOL || 'Unknown',
    ltp: selectedDataPoint?.ltp || null,
    bidPrice: selectedDataPoint?.bidPrice || null,
    askPrice: selectedDataPoint?.bidPrice || null,
    ltq: selectedDataPoint?.ltq || null,
    orderType, // "BUY" or "SELL"
    lotSize: 1000,
    orderLots: 50,
    quantity: 1000,
    priceType: isStopLossTarget ? "Limit" : "Market",
    isStopLossTarget,
    stopLoss: isStopLossTarget ? parseFloat(document.querySelector('input[placeholder="Stop Loss"]').value) || null : null,
    target: isStopLossTarget ? parseFloat(document.querySelector('input[placeholder="Target"]').value) || null : null,
    margin: 7885, // Example value
    carry: 7881, // Example value
    marginLimit: 0, // Example value
    userId: "USER_ID_HERE", // Replace with actual user ID
  };

  try {
    const response = await fetch("https://nex-trade-backend.vercel.app/api/v1/tradeorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (result.success) {
      toast.success(`Order placed successfully: ${orderType}`);
    } else {
      toast.error('Error placing order');
    }
  } catch (error) {
    console.error("Order submission error:", error);
  }
};

  
  // Load saved subscriptions from localStorage on mount
  // useEffect(() => {
  //   const savedSubscriptions = localStorage.getItem('subscriptions')
  //   if (savedSubscriptions) {
  //     setSubscriptions(JSON.parse(savedSubscriptions))
  //   }
  // }, [])

  // Save subscriptions to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  // }, [subscriptions])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Book1.xlsx')
        const blob = await response.blob()
        const reader = new FileReader()

        reader.onload = e => {
          const arrayBuffer = e.target.result
          const wb = XLSX.read(arrayBuffer, { type: 'array' })
          const wsName = wb.SheetNames[0]
          const ws = wb.Sheets[wsName]
          const jsonData = XLSX.utils.sheet_to_json(ws)
          setData(jsonData)
        }
        reader.readAsArrayBuffer(blob)
      } catch (error) {
        console.error('Error fetching or parsing Excel file:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (Object.keys(subscriptions).length === 0) return

    setIsLoading(false)
    const wsUrl = `wss://api-feed.dhan.co?version=2&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzQzNzA1MjkyLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly92ZWRhbnRhdHJhZGUuY29tLyIsImRoYW5DbGllbnRJZCI6IjExMDAyNzk5NzQifQ.8XpKqQjU7s5KaV3ONp_eW9S8OBZwb4uKXfFyTm8EWJVR8YMUB6029XZPx712RgFk7QCEl8AEoDWxmWp-KSCwcg&clientId=1100279974&authType=2`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected successfully.')
      Object.keys(subscriptions).forEach(securityId => {
        if (subscriptions[securityId].isChecked) {
          console.log(
            'Subscribing to:',
            securityId,
            subscriptions[securityId].exchangeSegment
          )
          if (
            info.some(
              item => item.SEM_SMST_SECURITY_ID === parseInt(securityId)
            )
          ) {
            subscribe(securityId, ws)
          } else {
            console.error(
              'Skipping subscription, instrument not found:',
              securityId
            )
          }
        }
      })
    }

    ws.onmessage = event => {
      console.log('WebSocket Message Received:', event.data)

      event.data.arrayBuffer().then(buffer => {
        const binaryData = new Uint8Array(buffer)
        console.log('Binary Data Received:', binaryData)

        const decodedData = decodeBinaryData(binaryData)
        console.log(' Decoded Data:', decodedData)

        if (!decodedData.securityId) {
          console.error(' No securityId found in decoded data.')
          return
        }

        console.log(' Correct securityId:', decodedData.securityId)

        setLiveData(prev => ({
          ...prev,
          [decodedData.securityId]: decodedData
        }))
      })
      console.log('LiveData:', liveData)
      setIsLoading(false)
    }

    ws.onerror = error => {
      console.error('WebSocket Error:', error)
      setIsLoading(false)
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      setIsLoading(false)
    }

    return () => {
      ws.close()
      setIsLoading(false)
    }
  }, [subscriptions, info])

  const subscribe = (securityId, ws) => {
    const instrument = info.find(
      item => item.SEM_SMST_SECURITY_ID === parseInt(securityId)
    )
    if (!instrument) {
      console.error('Instrument not found for ID:', securityId)
      return
    }

    const mappedSegment =
      instrument.SEM_EXM_EXCH_ID === 'NSE'
        ? 'NSE_FNO'
        : instrument.SEM_EXM_EXCH_ID === 'BSE'
        ? 'BSE_FNO'
        : instrument.SEM_EXM_EXCH_ID === 'MCX'
        ? 'MCX_COMM'

        : instrument.SEM_EXM_EXCH_ID

    const subscribeMessage = {
      RequestCode: 21,
      InstrumentCount: 2,
      InstrumentList: [
        {
          ExchangeSegment: mappedSegment,
          SecurityId: securityId
        }
      ]
    }

    console.log('Sending WebSocket subscription request:', subscribeMessage)
    ws.send(JSON.stringify(subscribeMessage))
  }

  function decodeBinaryData(uint8Array) {
    if (!uint8Array || uint8Array.byteLength < 4) {
      console.error('Invalid binary data received.');
      return null;
    }
  
    const byteLength = uint8Array.byteLength;
    const idArray = Object.keys(subscriptions).map(Number);
    console.log(idArray);
  
    let response = {
      securityId: idArray,
      ltp: 1.4,
      ltq: 3.4,
      ltt: 4.4,
      atp: 6.4,
      volume: 76,
      tsq: 45,
      tbq: 34,
      dov: 94,
      dcv: 98.3,
      dhv: 4.545,
      dlv: 5.65,
      bidPrice: 8765.5,
      askPrice: 767.7
    };
  
    const dataView = new DataView(uint8Array.buffer);
    if (byteLength < 8) return response;
    
    let offset = 8;
    offset += 4;
    
    if (offset + 4 > dataView.byteLength) {
      console.error("Attempted to read beyond buffer size.");
      return response;  // Stop execution
  }
  response.ltp = dataView.getFloat32(offset, true);
  offset += 4;
  
    
    response.ltq = parseInt(dataView.getInt16(offset, true).toString().slice(0, 4)); 
    offset += 4;
    if (byteLength < 18) return response;
    
    response.ltt = parseInt(dataView.getInt32(offset, true).toString().slice(0, 4)); 
    offset += 4;
    if (byteLength < 22) return response;
    
    response.atp = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 4;
    if (byteLength < 26) return response;
    
    response.volume = parseInt(dataView.getInt32(offset, true).toString().slice(0, 4)); 
    offset += 4;
    if (byteLength < 30) return response;
    
    response.tsq = parseInt(dataView.getInt32(offset, true).toString().slice(0, 4)); 
    offset += 4;
    if (byteLength < 34) return response;
    
    response.tbq = parseInt(dataView.getInt32(offset, true).toString().slice(0, 4)); 
    offset += 4;
    if (byteLength < 38) return response;
    
    response.dov = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 4;
    if (byteLength < 42) return response;
    
    response.dcv = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 4;
    if (byteLength < 46) return response;
    
    response.dhv = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 4;
    if (byteLength < 50) return response;
    
    response.dlv = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 28;
    if (byteLength < 78) return response;
    
    response.bidPrice = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    offset += 4;
    if (byteLength < 82) return response;
    
    response.askPrice = parseFloat(dataView.getFloat32(offset, true).toFixed(2));
    
    return response;
    
  
   
  }
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      return
    }

    const filtered = info.filter(row => {
      const instrumentName = row?.SEM_INSTRUMENT_NAME?.toUpperCase()
      const customSymbol = row?.SEM_CUSTOM_SYMBOL?.toUpperCase()
      const exchid= row?.SEM_EXM_EXCH_ID?.toUpperCase()
      const searchText = searchTerm.toUpperCase()

      if (activeTab === 'BSE-OPT' && exchid.includes('BSE') && instrumentName.includes('OPT')) {
        return customSymbol.includes(searchText)
      }

      if (activeTab === 'BSE-FUT' && exchid.includes('BSE') && instrumentName.includes('FUT')) {
        return customSymbol.includes(searchText)
      }

      if (activeTab === 'NSEFUT' && exchid.includes('NSE') && instrumentName.includes('FUT')) {
        return customSymbol.includes(searchText)
      }
      if (activeTab === 'NSEOPT' && exchid.includes('NSE') && instrumentName.includes('OPT')) {
        return customSymbol.includes(searchText)
      }
      if (activeTab === 'MCXFUT' && exchid.includes('MCX') && instrumentName.includes('FUT')) {
        return customSymbol.includes(searchText)
      }
      if (activeTab === 'MCXOPT' && exchid.includes('MCX') && instrumentName.includes('OPT')) {
        return customSymbol.includes(searchText)
      }

      return false
    })

    setSearchResults(filtered)
  }, [searchTerm, info, activeTab])

  const handleCheckboxChange = (securityId, exchangeSegment) => {
    const mappedSegment =
      exchangeSegment === 'NSE'
        ? 'NSE_FNO'
        : exchangeSegment === 'BSE'
        ? 'BSE_FNO'
        : exchangeSegment === 'MCX'
        ? 'MCX_COMM'
        : exchangeSegment
        

    console.log('Selected ID:', securityId)
    console.log('Mapped Exchange Segment:', mappedSegment)

    const isChecked = !subscriptions[securityId]?.isChecked
    const updatedSubscriptions = {
      ...subscriptions,
      [securityId]: { isChecked, exchangeSegment: mappedSegment }
    }
    setSubscriptions(updatedSubscriptions)

    if (isChecked) {
      console.log('Attempting to subscribe with:', {
        ExchangeSegment: mappedSegment,
        SecurityId: securityId
      })
    } else {
      console.log('Unsubscribing:', securityId)
    }
  }





  return (
    <div className="bg-[#071824] h-[1200px] text-white flex flex-col"> 
      {/* Funds & Balance Section */}
      <div className="p-4 border-b border-gray-700 container mx-auto">  
        <h2 className="text-lg font-semibold">Funds</h2>
        <div className="flex lg:justify-between flex-col mt-2 gap-4 ">
         <div className="flex justify-between">
         <div>
            <p className="text-sm">Ledger Balance</p>
            <p className="text-xl font-bold">₹7,243,81</p>
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
<div>
<p className=" container mx-auto text-xs text-gray-400  mb-6 p-2 border-b border-gray-700">
          Trade smart, trade happy. Let your profits smile back at you!
        </p>
</div>


<div className='flex space-x-4 mt-6 p-4 border-gray-600 border-b overflow-x-auto mb-6'>
        {['NSEFUT', 'NSEOPT', 'MCXFUT', 'MCXOPT', 'BSE-FUT', 'BSE-OPT'].map(
          item => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-2 focus:outline-none ${
                activeTab === item
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400'
              } hover:text-white`}
            >
              {item}
            </button>
          )
        )}
      </div>
      <div className='flex items-center space-x-3 bg-[#213743] m-4 p-3 rounded-sm cursor-pointer'>
        <img
          className='w-6 h-6'
          src='https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png'
          alt='search'
        />
        <input
          type='text'
          placeholder='Search & Add New Symbols'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='bg-[#1A2C38] p-2 border rounded-md w-full text-white placeholder-gray-400'
        />
      </div>
      <div className='p-4'>
        {searchResults.length > 0 && (
          <ul className='bg-gray-800 p-2 rounded-md'>
            {searchResults.map(item => (
              <li
                key={item.SEM_SMST_SECURITY_ID}
                className='flex justify-between items-center p-2 border-gray-600 border-b'
              >
                <span>{item.SEM_TRADING_SYMBOL}</span>
                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={
                      subscriptions[item.SEM_SMST_SECURITY_ID]?.isChecked ||
                      false
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        item.SEM_SMST_SECURITY_ID,
                        item.SEM_EXM_EXCH_ID
                      )
                    }
                    className='w-4 h-4'
                  />
                  <span>Future</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='p-4'>
        {isLoading ? (
          <p>Loading live data...</p>
        ) : (
          <table className='border border-gray-800 w-full border-collapse'>
            <thead>
              <tr className='bg-gray-800 text-white'>
                <th className='p-2 px-8 text-left'>Script</th>
                <th className='p-2'>Bid</th>
                <th className='p-2'>Ask</th>
                <th className='p-2'>Ltp</th>
                <th className='p-2'>Ch</th>
                <th className='p-2'>Chp</th>
                {/* <th className='p-2'>Avg Price</th>
                <th className='p-2'>Volumn</th>
                <th className='p-2'>Sell</th>
                <th className='p-2'>Buy</th> */}
                <th className='p-2'>Open</th>
                <th className='p-2'>Close</th>
                <th className='p-2'>High</th>
                <th className='p-2'>Low</th>
                <th className='p-2'>Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(liveData).map(dataPoint => {
                const scriptName =
                  info.find(
                    item =>
                      item.SEM_SMST_SECURITY_ID ===
                      parseInt(dataPoint.securityId)
                  )?.SEM_TRADING_SYMBOL || 'Unknown'
                const timeValue = dataPoint.timestamp
                  ? new Date(dataPoint.timestamp).toLocaleTimeString()
                  : 'N/A'
                return (
                  <tr
                    key={dataPoint.securityId}
                    className='border-[#071824] border-3 border-b-gray-800 text-center'
                    onClick={() => handleRowClick(dataPoint)}
                  >
                    <td className='p-2 px-8 text-left'>
                      {scriptName || 'N/A'}
                    </td>
                    <td className='p-2'>
                      <span className='text-green-500'>
                        {dataPoint.bidPrice || 'N/A'}
                      </span>
                    </td>
                    <td className='p-2'>
                      <span className='text-green-500'>
                        {dataPoint.bidPrice || 'N/A'}
                      </span>
                    </td>
                    <td className='p-2'>{dataPoint.ltp || 'null'}</td>
                    <td className='p-2'>{dataPoint.ltq || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.ltt || 'N/A'}</td>
                    {/* <td className='p-2'>{dataPoint.atp || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.volumn || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.tsq || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.tbq || 'N/A'}</td> */}
                    <td className='p-2'>{dataPoint.averagePrice || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dcv || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dhv || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dlv || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.time || 'N/A'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
        )}
  {selectedDataPoint && (
  <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
    <div className="bg-[#151f36] text-white p-6 rounded-lg w-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={closeModal} className="text-gray-400 text-xl">
          ✖
        </button>
      </div>

      {/* Stop Loss / Target Toggle Switch */}
      <div className="flex justify-between items-center mb-3">
        <span>Stop Loss / Target</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isStopLossTarget}
            onChange={() => setIsStopLossTarget(!isStopLossTarget)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition"></div>
        </label>
      </div>

      {/* Order Info */}
      <div className='flex justify-between'>
        <div className="mb-4">
          <h3 className="text-lg font-bold">
            {info.find(item => item.SEM_SMST_SECURITY_ID === parseInt(selectedDataPoint?.securityId))?.SEM_TRADING_SYMBOL || 'Unknown'}
          </h3>
          <p className="text-gray-400 text-sm">{selectedDataPoint?.ltp || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">{selectedDataPoint?.bidPrice || "N/A"}</p>
          <p className="text-gray-400 text-sm">{selectedDataPoint?.askPrice || "N/A"}</p>
          <p className="text-gray-400 text-sm">{selectedDataPoint?.ltq || "N/A"}</p>
        </div>
      </div>

      {/* Lot Size & Quantity */}
<div className="flex justify-between text-gray-300 mb-2 bg-gray-800 p-3 text-sm">
  <span>Max Lots : 50</span>
  <span>Order Lots: 50</span>
  <span>Lot Size : {lotSize}</span>
  <span>Qty: {calculatedQty}</span>
</div>


      {/* Stop Loss / Target Input Fields */}
      {isStopLossTarget && (
        <div className="flex gap-2 mb-3">
          <input type="number" placeholder="Stop Loss" className="w-1/2 p-2 bg-gray-800 text-white rounded" />
          <input type="number" placeholder="Target" className="w-1/2 p-2 bg-gray-800 text-white rounded" />
        </div>
      )}

      {/* Input Fields */}
      <div className="flex gap-2 mb-3">
        <input type="text" value="Market" className="w-1/2 p-2 bg-gray-800 text-white rounded" readOnly />
        <input
  type="number"
  value={orderLots}
  onChange={(e) => setOrderLots(e.target.value)}
  className="w-1/2 p-2 bg-gray-800 text-white rounded"
/>

      </div>

      {/* Market / Manual Buttons */}
      <div className="flex gap-2 mb-4">
        <button className="w-1/2 p-2 border-2 border-blue-900 text-blue-400 rounded">Market</button>
       {!isStopLossTarget && (
         <button className="w-1/2 p-2 border-2 border-gray-500 text-gray-300 rounded">Limit</button>
       )}
      </div>
      <div className="flex justify-between text-gray-300 mb-2 bg-gray-800 mt-9 mb-5 p-3 text-sm">
        <span>Margin: 7885</span>
        <span>Carry: 7881</span>
        <span>Margin Limit : ₹ 0</span>
       

      </div>
      {/* BUY & SELL Buttons */}
      <div className="flex gap-4">
      <button onClick={() => handleOrder("BUY")} className="w-1/2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
  BUY
</button>

<button onClick={() => handleOrder("SELL")} className="w-1/2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
  SELL
</button>

      </div>
    </div>
  </div>
)}

      </div>





    

      {/* Bottom Navigation */}
 <div className=' mt-auto w-full'>
 <BottomNav/>
 </div>
 <ToastContainer />
    </div>
  );
};

export default MarketWatch;
