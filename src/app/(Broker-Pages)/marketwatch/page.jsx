'use client'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import Navbar from '../../Components/Navbar'

const MarketPage = () => {
  const [info, setData] = useState([])
  const [activeTab, setActiveTab] = useState('BSE-FUT')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [subscriptions, setSubscriptions] = useState({})
  const [liveData, setLiveData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [isBrokerage, setIsBrokerage] = useState(false);

  const handleRowClick = (dataPoint) => {
    setSelectedDataPoint(dataPoint);
  };

  const closeModal = () => {
    setSelectedDataPoint(null);
  };
  
  // Load saved subscriptions from localStorage on mount
  // useEffect(() => {
  //   const savedSubscriptions = localStorage.getItem('subscriptions')
  //   if (savedSubscriptions) {
  //     setSubscriptions(JSON.parse(savedSubscriptions))
  //   }
  // }, [])

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

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
        : instrument.SEM_EXM_EXCH_ID

    const subscribeMessage = {
      RequestCode: 15,
      InstrumentCount: 1,
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

  function decodeBinaryData (uint8Array) {
    if (!uint8Array || uint8Array.byteLength < 4) {
      console.error('Invalid binary data received.')
      return null
    }

    // Implement binary decoding here based on Dhan API documentation.
    // Example (replace with actual logic):
    const byteLength = uint8Array?.byteLength //16
    const idArray = Object.keys(subscriptions).map(Number)
    console.log(idArray)

    let response = {
      securityId: idArray,
      ltp: 'No Data',
      ltq: 'No Data',
      ltt: 'No Data',
      atp: 'No Data',
      volume: 'No Data',
      tsq: 'No Data',
      tbq: 'No Data',
      dov: 'No Data',
      dcv: 'No Data',
      dhv: 'No Data',
      dlv: 'No Data',
      bidPrice: 'No Data',
      askPrice: 'No Data'
    }

    const dataView = new DataView(uint8Array.buffer)
    if (byteLength < 8) {
      return response
    }

    let offset = 8
    offset = offset + 4
    //Example code that will need to be changed to match the Dhan API.
    // const value = dataView.getUint32(0, true);
    // const securityId = dataView.getInt32(offset, true);
    // offset += 4;
    response.ltp = dataView.getFloat32(offset, true)
    offset = offset + 2
    if (byteLength < 14) {
      return response
    }
    response.ltq = dataView.getInt16(offset, true)
    offset = offset + 4
    if (byteLength < 18) {
      return response
    }
    response.ltt = dataView.getInt32(offset, true)
    offset = offset + 4
    if (byteLength < 22) {
      return response
    }
    response.atp = dataView.getFloat32(offset, true)
    offset = offset + 4
    if (byteLength < 26) {
      return response
    }
    response.volume = dataView.getInt32(offset, true)
    offset = offset + 4
    if (byteLength < 30) {
      return response
    }
    response.tsq = dataView.getInt32(offset, true)
    offset = offset + 4
    if (byteLength < 34) {
      return response
    }
    response.tbq = dataView.getInt32(offset, true)
    offset = offset + 4
    if (byteLength < 38) {
      return response
    }
    response.dov = dataView.getFloat32(offset, true)
    offset = offset + 4
    if (byteLength < 42) {
      return response
    }
    response.dcv = dataView.getFloat32(offset, true)
    offset = offset + 4
    if (byteLength < 46) {
      return response
    }
    response.dhv = dataView.getFloat32(offset, true)
    offset = offset + 4
    if (byteLength < 50) {
      return response
    }
    response.dlv = dataView.getFloat32(offset, true)
    offset = offset + 28
    if (byteLength < 78) {
      return response
    }
    response.bidPrice = dataView.getFloat32(offset, true)
    offset = offset + 4
    if (byteLength < 82) {
      return response
    }
    response.askPrice = dataView.getFloat32(offset, true)

    return response
  }

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      return
    }

    const filtered = info.filter(row => {
      const instrumentName = row?.SEM_INSTRUMENT_NAME?.toUpperCase()
      const customSymbol = row?.SEM_CUSTOM_SYMBOL?.toUpperCase()
      const searchText = searchTerm.toUpperCase()

      if (activeTab === 'BSE-OPT' && instrumentName.includes('OPT')) {
        return customSymbol.includes(searchText)
      }

      if (activeTab === 'BSE-FUT' && instrumentName.includes('FUT')) {
        return customSymbol.includes(searchText)
      }

      if (activeTab === 'NSEFUT' && instrumentName.includes('OPT')) {
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
    <div className='bg-[#071824] min-h-screen text-white'>
      <Navbar />
      <div className='flex space-x-4 mt-6 p-4 border-gray-600 border-b overflow-x-auto'>
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
                    <td className='p-2'>{dataPoint.ltp || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.ltq || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.ltt || 'N/A'}</td>
                    {/* <td className='p-2'>{dataPoint.atp || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.volumn || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.tsq || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.tbq || 'N/A'}</td> */}
                    <td className='p-2'>{dataPoint.dov || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dcv || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dhv || 'N/A'}</td>
                    <td className='p-2'>{dataPoint.dlv || 'N/A'}</td>
                    <td className='p-2'>{timeValue || 'N/A'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
        )}
     {selectedDataPoint && (
      <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center ">
        <div className="bg-[#151f36] text-white p-6 rounded-lg w-[600px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {/* <h2 className="text-lg font-semibold">Order Details</h2> */}
            <button onClick={closeModal} className="text-gray-400 text-xl">
              ✖
            </button>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-between items-center mb-3">
            <span>Add Brokerage?</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isBrokerage}
                onChange={() => setIsBrokerage(!isBrokerage)}
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition"></div>
            </label>
          </div>

          {/* Dropdown */}
          <div className="mb-3">
            <select className="w-full p-2 bg-gray-800 text-gray-300 rounded">
              <option>Select or search a user...</option>
              {/* Add user options dynamically */}
            </select>
          </div>

          {/* Order Info */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">{info.find(item => item.SEM_SMST_SECURITY_ID === parseInt(selectedDataPoint?.securityId))?.SEM_TRADING_SYMBOL || 'Unknown'}</h3>
            <p className="text-gray-400 text-sm">27 MAR LTP {selectedDataPoint?.ltp || "N/A"}</p>

          </div>

          {/* Lot Size & Quantity */}
          <div className="flex justify-between text-gray-300 mb-2 bg-gray-600 p-2">
            <span>Lot Size: 1000</span>
            <span>Qty: 1000</span>
          </div>

          {/* Input Fields */}
          <div className="flex gap-2 mb-3">
            <input type="text" value="Market" className="w-1/2 p-2 bg-gray-800 text-white rounded" readOnly />
            <input type="number" value="1" className="w-1/2 p-2 bg-gray-800 text-white rounded" />
          </div>

          {/* Market / Manual Buttons */}
          <div className="flex gap-2 mb-4">
            <button className="w-1/2 p-2 border-2 border-blue-900 text-blue-400 rounded">Market</button>
            <button className="w-1/2 p-2 border-2 border-gray-500 text-gray-300 rounded">Manual</button>
          </div>

          {/* BUY & SELL Buttons */}
          <div className="flex gap-4">
            <button className="w-1/2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
              BUY
            </button>
            <button className="w-1/2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
              SELL
            </button>
          </div>
        </div>
      </div>
    )}
      </div>
    </div>
  )
}

export default MarketPage