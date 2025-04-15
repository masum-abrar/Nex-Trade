'use client';
import { useEffect, useState } from 'react';

export default function MarketFeed() {
  const [data, setData] = useState(null);
  const socketUrl =
    'wss://api-feed.dhan.co?version=2&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzQzNzA1MjkyLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly92ZWRhbnRhdHJhZGUuY29tLyIsImRoYW5DbGllbnRJZCI6IjExMDAyNzk5NzQifQ.8XpKqQjU7s5KaV3ONp_eW9S8OBZwb4uKXfFyTm8EWJVR8YMUB6029XZPx712RgFk7QCEl8AEoDWxmWp-KSCwcg&clientId=1100279974&authType=2';

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected!');

      const payload ={
    RequestCode : 15,
    InstrumentCount : 2,
    InstrumentList : [
        {
            ExchangeSegment : "NSE_EQ",
            SecurityId : "1333"
        },
        {
            ExchangeSegment : "BSE_EQ",
            SecurityId : "532540"
        }
    ]
}
  
      
      socket.send(JSON.stringify(payload));

      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = async (event) => {
      console.log('Raw data received:', event.data);

      try {
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          console.log('Received Uint8Array:', uint8Array);

          try {
            const decodedData = decodeBinaryData(uint8Array);
            setData(decodedData);
            console.log('Binary data decoded:', decodedData);
          } catch (binaryError) {
            console.error('Binary decoding error:', binaryError);
            setData('Binary decoding error. Check console.');
          }
        } else {
          console.error('Expected Blob data.');
          setData('Expected Blob data.');
        }
      } catch (error) {
        console.error('Error processing data:', error);
        setData('Error processing data. Check console.');
      }
    };

    socket.onerror = (error) => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket disconnected.');

    return () => socket.close();
  }, []);

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

  

  return (
    <div>
      <h2>Live Market Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
