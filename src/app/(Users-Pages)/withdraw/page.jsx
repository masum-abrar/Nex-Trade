'use client'; 

import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const WithdrawRequestForm = () => {

  const [brokerUser, setBrokerUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Withdraw',
    amount: '',
    upi: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    loginUserId: '',
    username: '',
  });


  useEffect(() => {
   
    const fetchBrokerUser = async () => {
       const userInfo = Cookies.get('userInfo');
       const userId = JSON.parse(userInfo).id; // Get the userId from the userInfo state
      try {
        const res = await fetch(`https://nex-trade-backend.vercel.app/api/v1/brokerusers/${userId}`);
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  useEffect(() => {
    const storedUser = Cookies.get('userInfo');
  
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
  
        setFormData((prevData) => ({
          ...prevData,
          loginUserId: userInfo.userId,
          username: userInfo.username,
        }));
      } catch (err) {
        console.error("Invalid userInfo cookie:", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const amount = parseFloat(formData.amount);
    const balance = parseFloat(brokerUser?.ledgerBalanceClose || 0);
  
    if (amount < 1000) {
      toast.error("You cannot withdraw less than ₹1000");
      return;
    }
  
    if (amount > balance) {
      toast.error("Insufficient balance for withdrawal");
      return;
    }
  
    try {
      const res = await fetch('https://nex-trade-backend.vercel.app/api/v1/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
      console.log(data);
      toast.success('Request submitted successfully! wait for admin approval');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };
  

  return (
    <div className="max-w-full bg-gray-900 mx-auto p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        >
          <option value="Withdraw">Withdraw</option>
          {/* <option value="Deposit">Deposit</option> */}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Withdraw Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        />

        <input
          type="text"
          name="upi"
          placeholder="UPI / Mobile Number"
          value={formData.upi}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        />

        <input
          type="text"
          name="accountName"
          placeholder="Account Name"
          value={formData.accountName}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        />

        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        />

        <input
          type="text"
          name="ifsc"
          placeholder="IFSC Code"
          value={formData.ifsc}
          onChange={handleChange}
          className="w-full bg-gray-800 p-3 rounded border border-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded text-white font-semibold"
        >
          Submit
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        <p className="mb-1 font-semibold">Rules:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum Deposit & Withdrawal Amount is 1,000/- Rs.</li>
          <li>Kindly confirm Bank details / Upi ID before Deposit.</li>
          <li>Max. 1 Payout Transaction per Day per client.</li>
          <li>Withdrawals Time: 10:00 AM to 11:00 PM (Monday to Friday).</li>
          <li>Amount will be withdrawn to the same account from which it was deposited.</li>
        </ul>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default WithdrawRequestForm;
