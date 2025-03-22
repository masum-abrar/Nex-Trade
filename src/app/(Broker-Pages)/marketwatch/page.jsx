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
          subscribe(securityId, ws)
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
  }, [subscriptions])

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
    setSubscriptions({
      ...subscriptions,
      [securityId]: { isChecked, exchangeSegment: mappedSegment }
    })

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
                <th className='p-2'>LTQ</th>
                <th className='p-2'>LTT</th>
                <th className='p-2'>Avg Price</th>
                <th className='p-2'>Sell</th>
                <th className='p-2'>Buy</th>
                <th className='p-2'>Open</th>
                <th className='p-2'>Close</th>
                <th className='p-2'>High</th>
                <th className='p-2'>Low</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(liveData).map(dataPoint => (
                <tr
                  key={dataPoint.securityId}
                  className='border-[#071824] border-3 border-b-gray-800 text-center'
                >
                  <td className='p-2 px-8 text-left'>script</td>
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
                  <td className='p-2'>{dataPoint.atp || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.tsq || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.tbq || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.dov || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.dcv || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.dhv || 'N/A'}</td>
                  <td className='p-2'>{dataPoint.dlv || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MarketPage