'use client'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import Navbar from '../../Components/Navbar'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'  

const MarketPage = () => {
  const [info, setData] = useState([])
  const [activeTab, setActiveTab] = useState('BSE-FUT')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [subscriptions, setSubscriptions] = useState({})
  const [liveData, setLiveData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [isBrokerage, setIsBrokerage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const handleRowClick = dataPoint => {
    setSelectedDataPoint(dataPoint)
  }

  const closeModal = () => {
    setSelectedDataPoint(null)
  }

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

  function decodeBinaryData (uint8Array) {
    if (!uint8Array || uint8Array.byteLength < 10) {
      console.error('Invalid binary data received.')
      return null
    }

    const byteLength = uint8Array.byteLength
    const idArray = Object.keys(subscriptions).map(Number)
    console.log(idArray)
    console.log(byteLength)

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
    //  if (byteLength < 8) return response
    let offset = 8

    if (byteLength < offset + 2) return response
    offset += 2 // Adjust offset

    if (byteLength < offset + 4) return response
    response.ltp = dataView.getFloat32(offset, true)
    offset += 4

    if (byteLength < 14) return response

    response.ltq = parseInt(
      dataView.getInt16(offset, true).toString().slice(0, 4)
    )
    offset += 4
    if (byteLength < 18) return response

    response.ltt = parseInt(
      dataView.getInt32(offset, true).toString().slice(0, 4)
    )
    offset += 4
    if (byteLength < 22) return response

    response.atp = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 4
    if (byteLength < 26) return response

    response.volume = parseInt(
      dataView.getInt32(offset, true).toString().slice(0, 4)
    )
    offset += 4
    if (byteLength < 30) return response

    response.tsq = parseInt(
      dataView.getInt32(offset, true).toString().slice(0, 4)
    )
    offset += 4
    if (byteLength < 34) return response

    response.tbq = parseInt(
      dataView.getInt32(offset, true).toString().slice(0, 4)
    )
    offset += 4
    if (byteLength < 38) return response

    response.dov = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 4
    if (byteLength < 42) return response

    response.dcv = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 4
    if (byteLength < 46) return response

    response.dhv = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 4
    if (byteLength < 50) return response

    response.dlv = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 28
    if (byteLength < 78) return response

    response.bidPrice = parseFloat(dataView.getFloat32(offset, true).toFixed(2))
    offset += 4
    if (byteLength < 82) return response

    response.askPrice = parseFloat(dataView.getFloat32(offset, true).toFixed(2))

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
      const exchid = row?.SEM_EXM_EXCH_ID?.toUpperCase()
      const searchText = searchTerm.toUpperCase()

      if (
        activeTab === 'BSE-OPT' &&
        exchid.includes('BSE') &&
        instrumentName.includes('OPT')
      ) {
        return customSymbol.includes(searchText)
      }

      if (
        activeTab === 'BSE-FUT' &&
        exchid.includes('BSE') &&
        instrumentName.includes('FUT')
      ) {
        return customSymbol.includes(searchText)
      }

      if (
        activeTab === 'NSEFUT' &&
        exchid.includes('NSE') &&
        instrumentName.includes('FUT')
      ) {
        return customSymbol.includes(searchText)
      }
      if (
        activeTab === 'NSEOPT' &&
        exchid.includes('NSE') &&
        instrumentName.includes('OPT')
      ) {
        return customSymbol.includes(searchText)
      }
      if (
        activeTab === 'MCXFUT' &&
        exchid.includes('MCX') &&
        instrumentName.includes('FUT')
      ) {
        return customSymbol.includes(searchText)
      }
      if (
        activeTab === 'MCXOPT' &&
        exchid.includes('MCX') &&
        instrumentName.includes('OPT')
      ) {
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
    <div className='bg-[#071824] min-h-screen text-white'>
      <Navbar />
      {/* Navigation Tabs */}
      <div className='flex space-x-4 mt-6 p-4 border-gray-600 border-b overflow-x-auto whitespace-nowrap'>
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
          placeholder='Search & Add New SymbolNames'
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
                        item.SEM_EXM_EXCH_ID,
                        item.SEM_TRADING_SYMBOL
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
          <p className='text-sm text-center'>Loading live data...</p>
        ) : (
          <>
            {/* Desktop View (Table) */}
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
                        <td className='p-2'>
                          {dataPoint.averagePrice || 'N/A'}
                        </td>
                        <td className='p-2'>{dataPoint.dcv || 'N/A'}</td>
                        <td className='p-2'>{dataPoint.dhv || 'N/A'}</td>
                        <td className='p-2'>{dataPoint.dlv || 'N/A'}</td>
                        <td className='p-2'>
                          {new Date().toLocaleTimeString()}
                        </td>
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
          <div className='fixed inset-0 flex justify-center items-center bg-opacity-50'>
            <div className='bg-[#151f36] p-6 rounded-lg w-[600px] text-white'>
              {/* Header */}
              <div className='flex justify-between items-center mb-4'>
                {/* <h2 className="font-semibold text-lg">Order Details</h2> */}
                <button onClick={closeModal} className='text-gray-400 text-xl'>
                  ✖
                </button>
              </div>

              {/* Toggle Switch */}
              <div className='flex justify-between items-center mb-3'>
                <span>Add Brokerage?</span>
                <label className='inline-flex relative items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={isBrokerage}
                    onChange={() => setIsBrokerage(!isBrokerage)}
                  />
                  <div className='bg-gray-600 peer-checked:bg-blue-500 rounded-full w-11 h-6 transition'></div>
                </label>
              </div>

              {/* Dropdown */}
              <div className='mb-3'>
                <select className='bg-gray-800 p-2 rounded w-full text-gray-300'>
                  <option>Select or search a user...</option>
                  {/* Add user options dynamically */}
                </select>
              </div>

              {/* Order Info */}
              <div className='flex justify-between'>
                <div className='mb-4'>
                  <h3 className='font-bold text-lg'>
                    {info.find(
                      item =>
                        item.SEM_SMST_SECURITY_ID ===
                        parseInt(selectedDataPoint?.securityId)
                    )?.SEM_TRADING_SYMBOL || 'Unknown'}
                  </h3>
                  <p className='text-gray-400 text-sm'>
                    27 MAR LTP {selectedDataPoint?.ltp || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 text-sm'>
                    {' '}
                    {selectedDataPoint?.bidPrice || 'N/A'}
                  </p>
                  <p className='text-gray-400 text-sm'>
                    {' '}
                    {selectedDataPoint?.askPrice || 'N/A'}
                  </p>
                  <p className='text-gray-400 text-sm'>
                    {selectedDataPoint?.ltq || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Lot Size & Quantity */}
              <div className='flex justify-between bg-gray-600 mb-2 p-2 text-gray-300'>
                <span>Lot Size: 1000</span>
                <span>Qty: 1000</span>
              </div>

              {/* Input Fields */}
              <div className='flex gap-2 mb-3'>
                <input
                  type='text'
                  value='Market'
                  className='bg-gray-800 p-2 rounded w-1/2 text-white'
                  readOnly
                />
                <input
                  type='number'
                  value='1'
                  className='bg-gray-800 p-2 rounded w-1/2 text-white'
                />
              </div>

              {/* Market / Manual Buttons */}
              <div className='flex gap-2 mb-4'>
                <button className='p-2 border-2 border-blue-900 rounded w-1/2 text-blue-400'>
                  Market
                </button>
                <button className='p-2 border-2 border-gray-500 rounded w-1/2 text-gray-300'>
                  Manual
                </button>
              </div>

              {/* BUY & SELL Buttons */}
              <div className='flex gap-4'>
                <button className='bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded w-1/2 font-bold text-white'>
                  BUY
                </button>
                <button className='bg-red-600 hover:bg-red-800 px-4 py-2 rounded w-1/2 font-bold text-white'>
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
