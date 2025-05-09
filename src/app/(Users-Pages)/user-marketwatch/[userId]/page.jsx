"use client";
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { FaTrash, FaPlus, FaChartBar, FaShoppingCart, FaBolt, FaCog } from "react-icons/fa";
import BottomNav from "../../BotomNav";

const MarketWatch = ({ params }) => {
  const { userId } = params || {};
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
  const [brokerUser, setBrokerUser] = useState(null);
  const [ledgerBalance, setLedgerBalance] = useState(0);

const [marginUsed, setMarginUsed] = useState(0);
const [m2mAvailable, setM2mAvailable] = useState(0);

const lotSize = 30;
const calculatedQty = orderLots * lotSize;
const marginAvailable = brokerUser?.ledgerBalanceClose - brokerUser?.margin_used;


const segmentTabsMap = {
  NSE: ['NSEFUT', 'NSEOPT'],
  MCX: ['MCXFUT', 'MCXOPT'],
  BSE: ['BSE-FUT', 'BSE-OPT'],
};

 const loginUsrid = brokerUser?.loginUsrid || null;

const allowedSegments = brokerUser?.segmentAllow?.split(',') || [];


const visibleTabs = allowedSegments.flatMap(segment => segmentTabsMap[segment] || []);

 const router = useRouter();
 useEffect(() => {
  const userInfo = Cookies.get('userInfo');
  if (!userInfo) {
    router.replace('/login');
    return;
  }

  const user = JSON.parse(userInfo);


  if (user?.id !== userId) {
    router.replace('/unauthorized'); 
  }
}, [userId, router]);


const fetchBrokerUser = async () => {
  try {
    const res = await fetch(`https://nex-trade-backend.vercel.app/api/v1/brokerusers/${userId}`);
    const data = await res.json();
    if (data.success) {
      setBrokerUser(data.user);
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Failed to fetch broker user", error);
  }
};
useEffect(() => {
 

  fetchBrokerUser();
}, [userId]);

  const handleRowClick = (dataPoint) => {
    setSelectedDataPoint(dataPoint);
  };

  const closeModal = () => {
    setSelectedDataPoint(null);
  };

const handleOrder = async (orderType) => {
  const maxLots = brokerUser?.mcx_maxLots;

  // Check if orderLots exceed maxLots
  if (orderLots > maxLots) {
    toast.error("Order Lots should not exceed Max Lots");
    return;
  }

  const requiredMargin = (calculatedQty * selectedDataPoint?.askPrice) / brokerUser?.mcx_intraday;

  // Check if sufficient margin balance is available
  if (brokerUser?.ledgerBalanceClose < requiredMargin) {
    toast.error("Insufficient Margin Balance to place the trade");
    return;
  }

  // Prepare order data
  const orderData = {
    scriptName: info.find(item => item.SEM_SMST_SECURITY_ID === parseInt(selectedDataPoint?.securityId))?.SEM_TRADING_SYMBOL || 'Unknown',
    ltp: selectedDataPoint?.ltp || null,
    bidPrice: selectedDataPoint?.bidPrice || null,
    askPrice: selectedDataPoint?.askPrice || null,
    ltq: selectedDataPoint?.ltq || null,
    orderType, // "BUY" or "SELL"
    lotSize: 1000,
    orderLots: 50,
    quantity: calculatedQty,
    priceType: isStopLossTarget ? "Limit" : "Market",
    isStopLossTarget,
    stopLoss: isStopLossTarget ? parseFloat(document.querySelector('input[placeholder="Stop Loss"]').value) || null : null,
    target: isStopLossTarget ? parseFloat(document.querySelector('input[placeholder="Target"]').value) || null : null,
    margin: requiredMargin,
    carry: requiredMargin * 0.99,
    marginLimit: 0,
    userId: loginUsrid
  };

  try {
    // Call to update funds before placing the order
    const updateResponse = await fetch(`https://nex-trade-backend.vercel.app/api/v1/brokerusers/${userId}/update-funds`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        margin: requiredMargin,
        userId: userId // Send margin as the body to update funds
      }),
    });

    const updateResult = await updateResponse.json();

    // Check if funds update was successful
    if (updateResponse.ok && updateResult.success) {
      // Proceed to place the order
      const orderResponse = await fetch("https://nex-trade-backend.vercel.app/api/v1/tradeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();
      if (orderResult.success) {
        toast.success(`Order placed successfully: ${orderType}`);
        fetchBrokerUser();
      }
      
      else {
        toast.error('Error placing order');
      }
    } else {
      toast.error(`Error updating funds: ${updateResult.message}`);
    }
  } catch (error) {
    console.error("Order submission error:", error);
    toast.error('An error occurred while processing your order.');
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
      {/* {brokerUser && <p>Welcome User ID: {brokerUser.id}</p>}  */}
        <h2 className="text-lg font-semibold">Funds</h2>
        <div className="flex lg:justify-between flex-col mt-2 gap-4 ">
         <div className="flex justify-between">
         <div>
            <p className="text-sm">Ledger Balance</p>
            <p className="text-xl font-bold">{brokerUser?.ledgerBalanceClose}</p>
          </div>
          <div>
            <p className="text-sm">Margin Available</p>
            <p className="text-lg">₹{brokerUser ? brokerUser.ledgerBalanceClose - brokerUser.margin_used : 0}</p>
          </div>
         </div>
         <div className="flex justify-between">
         <div>
            <p className="text-sm">Margin Used</p>
            <p className="text-lg">{brokerUser?.margin_used }</p>
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
  {visibleTabs.map(item => (
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
  ))}
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
          <>
          <div className='hidden md:block overflow-x-auto'>
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
                        {dataPoint.askPrice || 'N/A'}
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
          </div>
           {/* Mobile View (Card Format) */}
           <div className='md:hidden space-y-4'>
           {Object.values(liveData).map(dataPoint => {
             const scriptName =
               info.find(
                 item =>
                   item.SEM_SMST_SECURITY_ID ===
                   parseInt(dataPoint.securityId)
               )?.SEM_TRADING_SYMBOL || 'Unknown'

             return (
               <div
                 key={dataPoint.securityId}
                 className='bg-[#213743] shadow-md p-3 rounded-md'
                 onClick={() => handleRowClick(dataPoint)}
               >
                 <div className='flex justify-between'>
                   <span className='font-semibold text-xs'>Qty : 0</span>
                   <span className='text-gray-100 text-xs'>
                     LTP : {dataPoint?.ltp || 'N/A'}
                   </span>
                 </div>
                 <div className='flex justify-between my-2 text-md'>
                   <div>
                     <span className='text-gray-100'>
                       {scriptName.includes('-')
                         ? scriptName.split('-')[0] // Show only before '-'
                         : scriptName.length > 10
                         ? scriptName.slice(0, 10) + '…' // Shorten long strings
                         : scriptName}
                     </span>
                   </div>
                   <div className='flex justify-between gap-x-5'>
                     <span className='text-green-600'>
                       {dataPoint?.bidPrice || 'N/A'}
                     </span>
                     <span className='text-red-600'>
                       {dataPoint?.askPrice || 'N/A'}
                     </span>
                   </div>
                 </div>
                 <div className='flex justify-between'>
                   <span className='text-gray-100 text-xs'>
                     {scriptName.includes('-')
                       ? scriptName.split('-')[1] // Show only before '-'
                       : scriptName.length > 10
                       ? scriptName.slice(0, 10) + '…' // Shorten long strings
                       : scriptName}
                   </span>

                   <span className='text-gray-100 text-xs'>
                     {dataPoint?.dhv || 'N/A'} ({dataPoint?.dlv || 'N/A'})
                   </span>
                 </div>
               </div>
             )
           })}
         </div>
         </>
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
        <span>Max Lots : {brokerUser?.mcx_maxLots ?? 'Loading...'}</span>
        <span>Order Lots: {orderLots}</span>
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

      {/* Margin & Carry Calculation */}
      <div className="flex justify-between text-gray-300 mb-2 bg-gray-800 mt-9 mb-5 p-3 text-sm">
        <span>Margin: {brokerUser?.mcx_intraday ? ((calculatedQty * selectedDataPoint?.askPrice) / brokerUser.mcx_intraday).toFixed(2) : 'Loading...'}</span>
        <span>
  Carry: {
    brokerUser?.mcx_intraday
      ? (
          ((calculatedQty * selectedDataPoint?.askPrice) / brokerUser.mcx_intraday) * 1.1
        ).toFixed(2)
      : 'Loading...'
  }
</span>

        <span>Margin Limit : {brokerUser?.mcx_holding ?? 'Loading...'}</span>
      </div>

      {/* BUY & SELL Buttons */}
      <div className="flex gap-4">
  <button
    onClick={() => handleOrder("BUY")}
    className="w-1/2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  >
    BUY
  </button>

  <button
    onClick={() => handleOrder("SELL")}
    className="w-1/2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
  >
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
