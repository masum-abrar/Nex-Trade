import React from "react";
import Navbar from "../Components/Navbar";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#071824] text-white">
     
      <Navbar />

    
      <div className="container mx-auto px-4 py-6">
       

       
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
          />
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
          />
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md ">
            Fetch Date
          </button>
        </div>

        {/* Summary Section */}
        <div className="grid md:grid-cols-3 gap-6 text-center mb-8 ">
          {[
            { label: "Sum PNL + BKG", value: "0.00" },
            { label: "Total Client Net PnL Sum", value: "0.00" },
            { label: "Total Brokerage Sum", value: "0.00" },
            { label: "Sharing Brokerage", value: "0.00" },
            { label: "Sharing PNL", value: "0.00" },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-gray-700 shadow-md rounded-md">
              <p className="text-white">{item.label}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto  shadow-md rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                {[
                  "User ID",
                  "Username",
                  "Client Net PNL",
                  "Client Brokerage",
                  "PNL + BKG",
                  "Settlement",
                  "Export Excel",
                  "Export PDF",
                ].map((heading, index) => (
                  <th key={index} className="p-3 ">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: "MO1234", name: "MONU" },
                { id: "MK1234", name: "MK1234" },
                { id: "MONU200", name: "MONU SONI" },
                { id: "MS1234", name: "MS" },
              ].map((user, index) => (
                <tr
                  key={index}
                  className=" transition duration-200"
                >
                  <td className="p-3 text-center ">{user.id}</td>
                  <td className="p-3 text-center  ">{user.name}</td>
                  <td className="p-3 text-center  ">0</td>
                  <td className="p-3 text-center ">0</td>
                  <td className="p-3 text-center ">0</td>
                  <td className="p-3 text-center ">0</td>
                  <td className="p-3 text-center ">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Export Excel
                    </button>
                  </td>
                  <td className="p-3 ">
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Export PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
