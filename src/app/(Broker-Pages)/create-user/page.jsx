'use client'
import Navbar from '@/app/Components/Navbar'
import Sidebar from '@/app/Components/Sidebar'
import React, { useState } from 'react'

const ToggleSwitch = ({ label }) => {
  const [enabled, setEnabled] = useState(false)
  return (
    <div className='flex justify-between items-center w-full max-w-xs'>
      <span className='text-gray-300 text-sm'>{label}</span>
      <button
        className={`relative w-12 h-6 flex items-center bg-gray-800 rounded-full p-1 transition ${
          enabled ? 'bg-indigo-600' : 'bg-gray-700'
        }`}
        onClick={() => setEnabled(!enabled)}
      >
        <div
          className={`w-4 h-4 bg-gray-300 rounded-full shadow-md transform transition ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </button>
    </div>
  )
}

  

 

const Page = () => {
  const [formData, setFormData] = useState({})
  const [showFields, setShowFields] = useState(false);
  const toggleFields = () => {
    setShowFields(!showFields);
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "ledgerBalanceClose",
        "profitTradeHoldMinSec",
        "lossTradeHoldMinSec",
        "mcx_maxExchLots",
        "mcx_commission",
        "mcx_maxLots",
        "mcx_orderLots",
        "mcx_limitPercentage",
        "mcx_intraday"
      ].includes(name)
        ? value ? parseInt(value, 10) : null  // ✅ Convert to integer or set null
        : name === "intradaySquare"
        ? value === "true" ? true : value === "false" ? false : null  // ✅ Handle boolean or null
        : value || null, // ✅ Set null if empty
    }));
  };
  
  
  
  ;


  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    console.log(formData)
    try {
      const response = await fetch(
        'http://localhost:4000/api/v1/brokerusers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert('Form submitted successfully!')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit the form.')
    }
  }
  return (
    <div className='flex bg-gray-900 h-screen text-white'>
      <Sidebar />
      <div className='flex-1 overflow-y-auto'>
        <Navbar />
        <div className='p-8'>
          <h2 className='mb-6 font-semibold text-2xl'>New User Settings</h2>
          <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
            {/* Left Column */}
            <form className='space-y-4' onSubmit={handleSubmit}>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      LOGIN USERID
    </label>
    <input
      type='text'
      name='loginUsrid'
      placeholder='XYB294'
      onChange={handleChange}
      className='block bg-gray-800 mt-1 p-4 border-gray-700 rounded-md w-full text-white'
    />
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Username
    </label>
    <input
      type='text'
      name='username'
      placeholder='Username'
      onChange={handleChange}
      className='block bg-gray-800 mt-1 p-4 border-gray-700 rounded-md w-full text-white'
    />
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Password
    </label>
    <input
      type='password'
      name='password'
      placeholder='Password'
      onChange={handleChange}
      className='block bg-gray-800 mt-1 p-4 border-gray-700 rounded-md w-full text-white'
    />
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Role
    </label>
    <select
      name='role'
      onChange={handleChange}
      className='block bg-gray-800 mt-1 p-4 border-gray-700 rounded-md w-full text-white'
    >
      <option value=''>Select Role</option>
      <option value='User'>User</option>
      <option value='Sub-Broker'>Sub-Broker</option>
    </select>
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Margin Type
    </label>
    <select
      onChange={handleChange}
      name='marginType'
      className='block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
    >
      <option value=''>Select Margin Type</option>
      <option>Credit</option>
      <option>Exposure</option>
    </select>
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Segment Allow
    </label>
    <span className='text-gray-400 text-xs'>
      Select the segment you want to allow user
    </span>
    <select
      onChange={handleChange}
      name='segmentAllow'
      className='block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
    >
      <option value=''>Select Segment</option>
      <option>NSE</option>
      <option>MCX</option>
      <option>CRYPTO</option>
      <option>FOREX</option>
    </select>
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Intraday Square
    </label>
    <select
      name="intradaySquare"
      onChange={handleChange}
      className="block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white"
    >
      <option value="">Select Value</option>
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Ledger Balance Close (%)
    </label>
    <input
      onChange={handleChange}
      name='ledgerBalanceClose'
      type='number'
      min='0'
      max='100'
      placeholder='90'
      className='block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
    />
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Profit Trade Hold Min Seconds
    </label>
    <input
      name='profitTradeHoldMinSec'
      onChange={handleChange}
      type='number'
      min='0'
      max='100'
      placeholder='0'
      className='block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
    />
  </div>
  <div>
    <label className='block font-medium text-gray-300 text-sm'>
      Loss Trade Hold Min Seconds
    </label>
    <input
      name='lossTradeHoldMinSec'
      onChange={handleChange}
      type='number'
      min='0'
      max='100'
      placeholder='0'
      className='block bg-gray-800 shadow-sm mt-1 p-4 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
    />
  </div>
  {/* <div>
    <button
      type='submit'
      className='bg-green-600 hover:bg-green-500 px-4 py-2 rounded w-full text-white'
    >
      Submit
    </button>
  </div> */}
  <div>
  <div
  onClick={() => setShowFields(!showFields)}
  className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
>
  {showFields ? 'Hide MCX' : 'Show MCX'}
</div>


      {showFields && (
      <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
      {/* MCX Max Exch Lots */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Max Exch Lots:
        </label>
        <input
          type="number"
          name="mcx_maxExchLots"
          value={formData.mcx_maxExchLots}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Commission Type */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Commission Type:
        </label>
        <select
          name="mcx_commissionType"
          value={formData.mcx_commissionType}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        >
          <option value="perCrore">Per Crore</option>
          <option value="perLot">Per Lot</option>
        </select>
      </div>
    
      {/* MCX Commission */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Commission:
        </label>
        <input
          type="number"
          name="mcx_commission"
          value={formData.mcx_commission}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Max Lots */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Max Lots:
        </label>
        <input
          type="number"
          name="mcx_maxLots"
          value={formData.mcx_maxLots}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Order Lots */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Order Lots:
        </label>
        <input
          type="number"
          name="mcx_orderLots"
          value={formData.mcx_orderLots}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Limit Percentage */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Limit Percentage:
        </label>
        <input
          type="number"
          name="mcx_limitPercentage"
          value={formData.mcx_limitPercentage}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Intraday */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Intraday:
        </label>
        <input
          type="number"
          name="mcx_intraday"
          value={formData.mcx_intraday}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* MCX Holding */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">
          MCX Holding:
        </label>
        <input
          type="text"
          name="mcx_holding"
          value={formData.mcx_holding}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    </div>
    
      )}
    </div>
    <div>
    <button
      type='submit'
      className='bg-green-600 hover:bg-green-500 px-4 py-2 rounded w-full text-white'
    >
      Submit
    </button>
  </div>
</form>



            {/* Right Column with Toggle Switches */}
            <div className='space-y-4'>
              {[
                'Activation',
                'Read Only',
                'Demo',
                'Intraday Square',
                'Block Limit Above/Below High Low',
                'Block Limit Between High Low'
              ].map(label => (
                <ToggleSwitch key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page