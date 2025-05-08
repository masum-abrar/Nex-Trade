'use client'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Page = () => {
  const [formData, setFormData] = useState({
    depositAmount: '',
    depositImage: '',
    loginUserId: '', // To store the loginUserId
    depositType: 'Deposit',
    status : 'Pending',
     // Static value for Deposit
  });


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
    const storedUser = Cookies.get('userInfo');
    if (storedUser) {
      const userInfo = JSON.parse(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        loginUserId: userInfo.userId, // Assign loginUserId from storedUser
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, depositImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const amount = parseFloat(formData.depositAmount);
  
    if (amount < 1000) {
      toast.error("You cannot Deposite less than ₹1000");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("depositAmount", formData.depositAmount);
    formDataToSend.append("depositImage", formData.depositImage);
    formDataToSend.append("loginUserId", formData.loginUserId);
    formDataToSend.append("depositType", formData.depositType);
    formDataToSend.append("status", formData.status);
  
    try {
      const response = await fetch('http://localhost:4000/api/v1/deposite', {
        method: 'POST',
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success('Deposit created successfully! wait for admin approval');
      } else {
        alert('Error creating deposit: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-800 p-6 max-w-3xl w-full shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Deposit Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">UPI</label>
            <input
              type="text"
              value="abcd@123"
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              value="9876543210"
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Account Name</label>
            <input
              type="text"
              value="ababa"
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Account Number</label>
            <input
              type="text"
              value="7894561230"
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">IFSC</label>
            <input
              type="text"
              value="ababa123456ed"
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Deposit</label>
            <input
              type="text"
              value={formData.depositType} // Display Deposit value from state
              readOnly
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Deposit Amount</label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Upload Deposit Proof</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded bg-gray-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>

        <h3 className="text-lg font-semibold mt-6">Rules:</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>Minimum Deposit & Withdrawal Amount is 1,000/- Rs.</li>
          <li>Kindly confirm Bank details / UPI ID before Deposit.</li>
          <li>Max. 1 Payout Transaction per Day per client.</li>
          <li>Withdrawals Time: 10:00 AM to 11:00 PM (Monday to Friday).</li>
          <li>Amount will be withdrawn to the same account from which it was deposited.</li>
        </ul>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Page;
