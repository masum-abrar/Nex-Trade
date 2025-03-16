"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api-scrip-master-one.xlsx"); // Fetch from public folder
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Excel Data</h2>
      {data.length > 0 ? (
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">SEM_EXM_EXCH_ID</th>
              <th className="border p-2">SEM_SMST_SECURITY_ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border">
                <td className="border p-2">{row.SEM_EXM_EXCH_ID || "N/A"}</td>
                <td className="border p-2">{row.SEM_SMST_SECURITY_ID || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
  
}
