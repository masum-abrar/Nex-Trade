'use client'
import { useEffect, useState } from "react";
import pako from "pako"; // Ensure pako is installed: npm install pako

export default function MarketFeed() {
    const [data, setData] = useState(null);
    const socketUrl = "wss://api-feed.dhan.co?version=2&token=YOUR_TOKEN&clientId=1100279974&authType=2";

    useEffect(() => {
        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            console.log("WebSocket connected!");

            const payload = {
                "RequestCode": 15,
                "InstrumentCount": 2,
                "InstrumentList": [
                    { "ExchangeSegment": "NSE_EQ", "SecurityId": "1333" },
                    { "ExchangeSegment": "BSE_EQ", "SecurityId": "532540" }
                ]
            };

            socket.send(JSON.stringify(payload));
        };

        socket.onmessage = async (event) => {
            console.log("Raw data received:", event.data);

            if (event.data instanceof Blob) {
                try {
                    const arrayBuffer = await event.data.arrayBuffer();
                    const decompressed = pako.inflate(new Uint8Array(arrayBuffer), { to: "string" });
                    const jsonData = JSON.parse(decompressed);
                    console.log("Parsed JSON:", jsonData);
                    setData(jsonData);
                } catch (error) {
                    console.error("Error processing compressed data:", error);
                }
            } else {
                try {
                    const jsonData = JSON.parse(event.data);
                    console.log("Parsed JSON:", jsonData);
                    setData(jsonData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        };

        socket.onerror = (error) => console.error("WebSocket error:", error);
        socket.onclose = () => console.log("WebSocket disconnected.");

        return () => socket.close();
    }, []);

    return (
        <div>
            <h2>Live Market Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
