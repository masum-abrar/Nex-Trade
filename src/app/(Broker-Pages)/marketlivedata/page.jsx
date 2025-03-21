"use client";
import { useEffect, useState } from "react";

export default function MarketFeed() {
  const [data, setData] = useState(null);
  const socketUrl =
    "wss://api-feed.dhan.co?version=2&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzQzNzA1MjkyLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiaHR0cHM6Ly92ZWRhbnRhdHJhZGUuY29tLyIsImRoYW5DbGllbnRJZCI6IjExMDAyNzk5NzQifQ.8XpKqQjU7s5KaV3ONp_eW9S8OBZwb4uKXfFyTm8EWJVR8YMUB6029XZPx712RgFk7QCEl8AEoDWxmWp-KSCwcg&clientId=1100279974&authType=2";

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected!");

      const payload = {
        RequestCode: 15,
        InstrumentCount: 2,
        InstrumentList: [
          //   { ExchangeSegment: "NSE_EQ", SecurityId: "1333" },
          { ExchangeSegment: "NSE_FNO", SecurityId: "133977" },
        ],
      };

      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = async (event) => {
      console.log("Raw data received:", event.data);

      try {
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          console.log("Received Uint8Array:", uint8Array);

          try {
            const decodedData = decodeBinaryData(uint8Array);
            setData(decodedData);
            console.log("Binary data decoded:", decodedData);
          } catch (binaryError) {
            console.error("Binary decoding error:", binaryError);
            setData("Binary decoding error. Check console.");
          }
        } else {
          console.error("Expected Blob data.");
          setData("Expected Blob data.");
        }
      } catch (error) {
        console.error("Error processing data:", error);
        setData("Error processing data. Check console.");
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket disconnected.");

    return () => socket.close();
  }, []);

  function decodeBinaryData(uint8Array) {
    // Implement binary decoding here based on Dhan API documentation.
    // Example (replace with actual logic):
    const byteLength = uint8Array?.byteLength;
    let response = {
      ltp: "No Data",
      ltq: "No Data",
      ltt: "No Data",
      atp: "No Data",
      volume: "No Data",
      tsq: "No Data",
      tbq: "No Data",
      dov: "No Data",
      dcv: "No Data",
      dhv: "No Data",
      dlv: "No Data",
    };

    const dataView = new DataView(uint8Array.buffer);
    if (byteLength < 12) {
      return response;
    }

    let offset = 8;
    offset = offset + 4;
    //Example code that will need to be changed to match the Dhan API.
    // const value = dataView.getUint32(0, true);
    // const securityId = dataView.getInt32(offset, true);
    // offset += 4;
    response.ltp = dataView.getFloat32(offset, true);
    offset = offset + 2;
    if (byteLength < 14) {
      return response;
    }
    response.ltq = dataView.getInt16(offset, true);
    offset = offset + 4;
    if (byteLength < 18) {
      return response;
    }
    response.ltt = dataView.getInt32(offset, true);
    offset = offset + 4;
    if (byteLength < 22) {
      return response;
    }
    response.atp = dataView.getFloat32(offset, true);
    offset = offset + 4;
    if (byteLength < 26) {
      return response;
    }
    response.volume = dataView.getInt32(offset, true);
    offset = offset + 4;
    if (byteLength < 30) {
      return response;
    }
    response.tsq = dataView.getInt32(offset, true);
    offset = offset + 4;
    if (byteLength < 34) {
      return response;
    }
    response.tbq = dataView.getInt32(offset, true);
    offset = offset + 4;
    if (byteLength < 38) {
      return response;
    }
    response.dov = dataView.getFloat32(offset, true);
    offset = offset + 4;
    if (byteLength < 42) {
      return response;
    }
    response.dcv = dataView.getFloat32(offset, true);
    offset = offset + 4;
    if (byteLength < 46) {
      return response;
    }
    response.dhv = dataView.getFloat32(offset, true);
    offset = offset + 4;
    if (byteLength < 50) {
      return response;
    }
    response.dlv = dataView.getFloat32(offset, true);

    return response;
  }

  return (
    <div>
      <h2>Live Market Data</h2>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
