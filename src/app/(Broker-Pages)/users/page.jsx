'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../Components/Navbar';
import Cookies from 'js-cookie';

const Page = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/brokerusers');
        const data = await res.json();
        setUsers(data); // assuming data is an array
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);
  const handleUpdate = (userId) => {
    if (userId) {
      router.push(`/update/${userId}`);
    } else {
      alert('User ID not found!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#071824] text-white">
      <Navbar />

      {/* Stats Section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg text-center shadow-md">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        {/* Other stat boxes can be added similarly */}
      </div>

      {/* Table Section */}
      <div className="p-6">
        <div className="p-6 rounded-lg shadow-md overflow-x-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 rounded-md border border-gray-400 bg-[#1A2C38] text-white placeholder-gray-300 mb-4"
          />

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-gray-800 text-gray-200">
                  <th className="p-3">UserID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">MarginType</th>
                  <th className="p-3">Segment</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-500 transition duration-200 text-center">
                    <td className="p-3">{user.loginUsrid}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.mobile || 'N/A'}</td>
                    <td className="p-3">{user.role}</td>
                    {/* <td className="p-3">{user.isActive ? 'YES' : 'NO'}</td> */}
                    <td className="p-3">{user.marginType}</td>
                    <td className="p-3">{user.segmentAllow}</td>
                    <td className="p-3">
                    <button
  onClick={() => handleUpdate(user.id)}
  className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600"
>
  Update
</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Optional) */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-gray-300">Showing {users.length} users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
