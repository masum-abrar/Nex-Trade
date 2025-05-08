"use client";
import React, { useState,useEffect } from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaBolt,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import BottomNav from "../BotomNav";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
const page = () => {
  const [showFunds, setShowFunds] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  // const router = useRouter();
  const [brokerUser, setBrokerUser] = useState(null);

 const router = useRouter();
       useEffect(() => {
         const userInfo = Cookies.get('userInfo');
       
         if (!userInfo) {
           router.push('/login');
         } else {
           const user = JSON.parse(userInfo);
       
           if (!user.userId || (user.role !== 'User')) {
             router.replace('/unauthorized'); 
           }
         }
       }, []);



useEffect(() => {
 
  const fetchBrokerUser = async () => {
    const userId = userInfo?.id; // Get the userId from the userInfo state
    try {
      const res = await fetch(`http://localhost:4000/api/v1/brokerusers/${userId}`);
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
  fetchBrokerUser();
}, [userInfo?.id]);




    useEffect(() => {
      const storedUser = Cookies.get('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    }, []);
     const handleLogout = () => {
        Cookies.remove('userId');  // Remove user ID
        Cookies.remove('username'); // Remove username
        Cookies.remove('role');
        Cookies.remove('id');
        Cookies.remove('ledgerBalanceClose'); // Remove ledger balance close
        Cookies.remove('userInfo'); // Remove user info
         // Remove role if needed
    
        router.push('/login'); // Redirect to login page
      };
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700 container mx-auto relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={() => setShowFunds(!showFunds)}
            className="text-white focus:outline-none"
          >
            <FaChevronDown
              className={`transition-transform ${
                showFunds ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {showFunds && (
          <div className="p-4 bg-gray-800 border-t border-gray-700 mt-2  w-full left-0 top-0 shadow-lg">
            <h2 className="text-lg font-semibold">Funds</h2>
            <div className="flex lg:justify-between flex-col mt-2 gap-4">
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
                  <p className="text-xl font-bold">{brokerUser?.margin_used}</p>

                </div>
                <div>
                  <p className="text-sm">M2M Available</p>
                  <p className="text-lg">₹0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-xl container mx-auto">
        <div className="space-y-2">
          <h1 className="font-bold">Margin Available</h1>
          <p className="text-lg">₹{brokerUser ? brokerUser.ledgerBalanceClose - brokerUser.margin_used : 0}</p>
          <Link href={"/withdraw"}>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Withdraw
          </button>
          </Link>
         <Link href={"/deposite"}>
         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-4">
            Deposit
          </button>
         </Link>
        </div>
     
      </div>
      <div className="space-y-2 mt-4 p-4 bg-gray-800 flex gap-4 rounded-xl container mx-auto">
     
  {userInfo && (
    <div className="flex gap-4">
      <div>
        <h1 className="font-bold">Userid</h1>
        <p>{userInfo.userId}</p>
      </div>
      <div>
        <h1 className="font-bold">Username</h1>
        <p>{userInfo.username}</p>
      </div>
    </div>
  )}
</div>


<div className="mt-4 p-4 bg-gray-800 rounded-xl container mx-auto mb-4">
  {["Ledger Logs", "Margin", "Change Password", "Scripts Setting", "Reports", "Logout"].map((item, index) => (
    <div
      key={index}
      className="py-3 border-b border-gray-700 text-white cursor-pointer hover:text-blue-400 transition"
      onClick={item === "Logout" ? handleLogout : undefined} // Add handleLogout on Logout
    >
      {item}
    </div>
  ))}
</div>



      {/* Bottom Navigation */}
     <BottomNav/>
    </div>
  );
};

export default page;
