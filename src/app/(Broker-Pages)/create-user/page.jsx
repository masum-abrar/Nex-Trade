'use client'
import Navbar from '@/app/Components/Navbar'
import Sidebar from '@/app/Components/Sidebar'
import React, { useState,useEffect } from 'react'

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
  const [formData, setFormData] = useState({
    mcx_maxExchLots: 20,
    mcx_commission:200,
    mcx_maxLots:50,
    mcx_orderLots:10,
    mcx_limitPercentage:0,
    mcx_holding:100,
    mcxOPTBUY_strike:50,
    mcxOPTBUY_commission:500,
    nse_maxExchLots:20,
    ledgerBalanceClose: 90,
    mcx_intraday:500

  })
  const [showFields, setShowFields] = useState(false);
  const [showMCXOPTBUY, setShowMCXOPTBUY] = useState(false);
  const [showMcxOptSell, setShowMcxOptSell] = useState(false);
  const [showMCXOPT, setShowMCXOPT] = useState(false);
  const [showNSE, setShowNSE] = useState(false);
  const [showIDXNSE, setShowIDXNSE] = useState(false);
  // NEW
  const [showIDXOPTBUY, setShowIDXOPTBUY] = useState(false);
  const [showIDXOPTSELL, setShowIDXOPTSELL] = useState(false);
  const [showIDXOPT, setShowIDXOPT] = useState(false);
  const [showSTKOPTBUY, setShowSTKOPTBUY] = useState(false);

  //new
  const [showSTKOPTSELL, setShowSTKOPTSELL] = useState(true); // Default show STKOPTSELL
  const [showSTKOPT, setShowSTKOPT] = useState(false);
  const [showSTKNSE, setShowSTKNSE] = useState(false);
  const [showSTKEQ, setShowSTKEQ] = useState(false);
  const [showBSEOPTBUY, setShowBSEOPTBUY] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
    const [segments, setSegments] = useState([]);
  
    const allOptions = ['NSE', 'MCX', 'CRYPTO', 'FOREX'];

  const toggleFields = () => {
    setShowFields(!showFields);
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'segmentAllow'
          ? Array.isArray(value)
            ? value.join(',')
            : value
          : [
              "ledgerBalanceClose",
              "profitTradeHoldMinSec",
              "lossTradeHoldMinSec",
              "mcx_maxExchLots",
              "mcx_commission",
              "mcx_maxLots",
              "mcx_orderLots",
              "mcx_limitPercentage",
              "mcx_intraday",
              
              "mcxOPTBUY_commission",
              "mcxOPTBUY_strike",
              "mcxOPTSELL_commission",
              "mcxOPTSELL_strike",
              "mcxOPT_maxLots",
              "mcxOPT_orderLots",
              "mcxOPT_limitPercentage",
              "mcxOPT_intraday",
              "mcxOPT_holding",
              "nse_maxExchLots",
              "idxNSE_commission",
              "idxNSE_maxLots",
              "idxNSE_orderLots",
              "idxNSE_limitPercentage",
              "idxNSE_intraday",
              "idxNSE_holding",
              "idxOPTBUY_commission",
              "idxOPTBUY_strike",
              "idxOPTSELL_commission",
              "idxOPTSELL_strike",
              "idxOPT_maxLots",
              "idxOPT_orderLots",
              "idxOPT_expiryLossHold",
              "idxOPT_expiryProfitHold",
              "idxOPT_expiryIntradayMargin",
              "idxOPT_limitPercentage",
              "idxOPT_intraday",
              "idxOPT_holding",
              "stkOPTBUY_commission",
              "stkOPTBUY_strike",
              "STKOPTSELL_commission",
              "STKOPTSELL_strike",
              "STKOPT_maxLots",
              "STKOPT_orderLots",
              "STKOPT_limitPercentage",
              "STKOPT_intraday",
              "STKOPT_holding",
            ].includes(name)
          ? value
            ? parseInt(value, 10)
            : null
          : name === "intradaySquare"
          ? value === "true"
            ? true
            : value === "false"
            ? false
            : null
          : value || null,
    }));
  };
  
  
  
  
  
  
  
  
  ;
  const generateUserId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * 26)) +
                          letters.charAt(Math.floor(Math.random() * 26)) +
                          letters.charAt(Math.floor(Math.random() * 26));
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    return randomLetters + randomNumbers;
  };
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const generatedId = generateUserId();
    setUserId(generatedId);
    handleChange({ target: { name: 'loginUsrid', value: generatedId } });
  }, []);

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
  const handleAdd = () => {
    if (selectedOption && !segments.includes(selectedOption)) {
      const newSegments = [...segments, selectedOption];
      setSegments(newSegments);
      handleChange({ target: { name: 'segmentAllow', value: newSegments } });
    }
  };

  const handleRemove = (segment) => {
    const newSegments = segments.filter(item => item !== segment);
    setSegments(newSegments);
    handleChange({ target: { name: 'segmentAllow', value: newSegments } });
  };
  
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
        value={userId}
        readOnly
        className='block bg-gray-800 mt-1 p-4 border-gray-700 rounded-md w-full text-white'
      />
    </div>
    <p className='text-green-400'>User ID is available.</p>
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
      <option value='Broker'>Broker</option>
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
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className='block bg-gray-800 shadow-sm mt-1 p-3 border-gray-700 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full text-white'
      >
        <option value=''>Select an option</option>
        {allOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <button
        type='button'
        onClick={handleAdd}
        className='mt-3 w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition'
      >
        Add
      </button>

      <div className='mt-4 space-y-2'>
        {segments.map((segment) => (
          <div key={segment} className='flex items-center justify-between bg-gray-900 px-4 py-2 rounded-md'>
            <span className='text-white'>{segment}</span>
            <button
              type='button'
              onClick={() => handleRemove(segment)}
              className='bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
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
   

    {/* MCXOPTBUY */}
    <div className="mt-6">
        <div
          onClick={() => setShowMCXOPTBUY(!showMCXOPTBUY)}
          className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[60%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
        >
          {showMCXOPTBUY ? 'Hide MCX Option Buying' : 'Show MCX Option Buying'}
        </div>

        {showMCXOPTBUY && (
          <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
            {/* MCXOPTBUY Commission Type */}
            <div className="mb-4">
              <label className="block font-medium text-gray-300 text-sm">
                MCX Option Buying Commission Type:
              </label>
              <select
                name="mcxOPTBUY_commissionType"
                value={formData.mcxOPTBUY_commissionType}
                onChange={handleChange}
                className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
              >
                <option value="perCrore">Per Crore</option>
                <option value="perLot">Per Lot</option>
              </select>
            </div>

            {/* MCXOPTBUY Commission */}
            <div className="mb-4">
              <label className="block font-medium text-gray-300 text-sm">
                MCX Option Buying Commission:
              </label>
              <input
                type="number"
                name="mcxOPTBUY_commission"
                value={formData.mcxOPTBUY_commission}
                onChange={handleChange}
                className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
              />
            </div>
          
            {/* MCXOPTBUY Strike */}
            <div className="mb-4">
              <label className="block font-medium text-gray-300 text-sm">
                MCX Option Buying Strike:
              </label>
              <input
                type="number"
                name="mcxOPTBUY_strike"
                value={formData.mcxOPTBUY_strike}
                onChange={handleChange}
                className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
              />
            </div>

            {/* MCXOPTBUY Allow */}
            <div className="mb-4">
              <label className="block font-medium text-gray-300 text-sm">
                MCX Option Buying Allow:
              </label>
              <select
                name="mcxOPTBUY_allow"
                value={formData.mcxOPTBUY_allow}
                onChange={handleChange}
                className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
              >
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
              </select>
            </div>
          </div>
        )}
      </div>


      {/* MCXOPTSELL */}

      {/* Toggle MCX Option Selling */}
<div
  onClick={() => setShowMcxOptSell(!showMcxOptSell)}
  className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[60%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300 mt-4"
>
  {showMcxOptSell ? "Hide MCX Option Selling" : "Show MCX Option Selling"}
</div>

{showMcxOptSell && (
  <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
    {/* MCX Option Selling Commission Type */}
    <div className="mb-4">
      <label className="block font-medium text-gray-300 text-sm">
        MCX Option Selling Commission Type:
      </label>
      <select
        name="mcxOPTSELL_commissionType"
        value={formData.mcxOPTSELL_commissionType}
        onChange={handleChange}
        className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
      >
        <option value="perCrore">Per Crore</option>
        <option value="perLot">Per Lot</option>
      </select>
    </div>

    {/* MCX Option Selling Commission */}
    <div className="mb-4">
      <label className="block font-medium text-gray-300 text-sm">
        MCX Option Selling Commission:
      </label>
      <input
        type="number"
        name="mcxOPTSELL_commission"
        value={formData.mcxOPTSELL_commission}
        onChange={handleChange}
        className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
      />
    </div>

    {/* MCX Option Selling Strike */}
    <div className="mb-4">
      <label className="block font-medium text-gray-300 text-sm">
        MCX Option Selling Strike:
      </label>
      <input
        type="number"
        name="mcxOPTSELL_strike"
        value={formData.mcxOPTSELL_strike}
        onChange={handleChange}
        className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
      />
    </div>

    {/* MCX Option Selling Allow */}
    <div className="mb-4">
  <label className="block font-medium text-gray-300 text-sm">
    MCX Option Selling Allow:
  </label>
  <select
    name="mcxOPTSELL_allow"
    value={formData.mcxOPTSELL_allow}
    onChange={handleChange}
    className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
  >
    <option value="Allow">Allow</option>
    <option value="Not Allow">Not Allow</option>
  </select>
</div>

  </div>
)}


{/* MCXOPT */}

<div>
  <div
    onClick={() => setShowMCXOPT(!showMCXOPT)}
    className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
  >
    {showMCXOPT ? 'Hide MCXOPT' : 'Show MCXOPT'}
  </div>

  {showMCXOPT && (
    <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
      {/* MCXOPT Max Lots */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Max Lots:</label>
        <input
          type="number"
          name="mcxOPT_maxLots"
          value={formData.mcxOPT_maxLots}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>

      {/* MCXOPT Order Lots */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Order Lots:</label>
        <input
          type="number"
          name="mcxOPT_orderLots"
          value={formData.mcxOPT_orderLots}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>

      {/* MCXOPT Limit Percentage */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Limit Percentage:</label>
        <input
          type="number"
          name="mcxOPT_limitPercentage"
          value={formData.mcxOPT_limitPercentage}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>

      {/* MCXOPT Intraday */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Intraday:</label>
        <input
          type="number"
          name="mcxOPT_intraday"
          value={formData.mcxOPT_intraday}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>

      {/* MCXOPT Holding */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Holding:</label>
        <input
          type="number"
          name="mcxOPT_holding"
          value={formData.mcxOPT_holding}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>

      {/* MCXOPT Selling Overnight */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">MCXOPT Selling Overnight:</label>
        <select
          name="mcxOPT_sellingOvernight"
          value={formData.mcxOPT_sellingOvernight}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        >
          <option value="allowed">Allowed</option>
          <option value="notAllowed">Not Allowed</option>
        </select>
      </div>
    </div>
  )}
</div>

{/* NSE and IDX */}
<div>
      {/* Toggle NSE */}
      <div
        onClick={() => setShowNSE(!showNSE)}
        className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showNSE ? 'Hide NSE' : 'Show NSE'}
      </div>

      {/* NSE Fields */}
      {showNSE && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          {/* NSE Max Exch Lots */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">NSE Max Exch Lots:</label>
            <input
              type="number"
              name="nse_maxExchLots"
              value={formData.nse_maxExchLots}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
        </div>
      )}

      {/* Toggle IDXNSE */}
      <div
        onClick={() => setShowIDXNSE(!showIDXNSE)}
        className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showIDXNSE ? 'Hide IDXNSE' : 'Show IDXNSE'}
      </div>

      {/* IDXNSE Fields */}
      {showIDXNSE && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          {/* IDXNSE Commission Type */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index CommissionType:</label>
            <select
              name="idxNSE_commissionType"
              value={formData.idxNSE_commissionType}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="perCrore">perCrore</option>
              <option value="perLot">perLot</option>
            </select>
          </div>

          {/* IDXNSE Commission */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXNSE_commission:</label>
            <input
              type="number"
              name="idxNSE_commission"
              value={formData.idxNSE_commission}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>

          {/* IDXNSE Max Lots */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Max Lots:</label>
            <input
              type="number"
              name="idxNSE_maxLots"
              value={formData.idxNSE_maxLots}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>

          {/* IDXNSE Order Lots */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Order Lots:</label>
            <input
              type="number"
              name="idxNSE_orderLots"
              value={formData.idxNSE_orderLots}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>

          {/* IDXNSE Limit Percentage */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Limit Percentage:</label>
            <input
              type="number"
              name="idxNSE_limitPercentage"
              value={formData.idxNSE_limitPercentage}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>

          {/* IDXNSE Intraday */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Intraday:</label>
            <input
              type="number"
              name="idxNSE_intraday"
              value={formData.idxNSE_intraday}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>

          {/* IDXNSE Holding */}
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Holding:</label>
            <input
              type="number"
              name="idxNSE_holding"
              value={formData.idxNSE_holding}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
        </div>
      )}
    </div>

{/* {FOur BUTTON} */}
<div>
      {/* Toggle IDXOPTBUY */}
      <div
        onClick={() => setShowIDXOPTBUY(!showIDXOPTBUY)}
        className="cursor-pointer bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showIDXOPTBUY ? 'Hide IDXOPTBUY' : 'Show IDXOPTBUY'}
      </div>

      {/* IDXOPTBUY Fields */}
      {showIDXOPTBUY && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Buying CommissionType:</label>
            <select
              name="idxOPTBUY_commissionType"
              value={formData.idxOPTBUY_commissionType}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="perCrore">perCrore</option>
              <option value="perLot">perLot</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTBUY_commission:</label>
            <input
              type="number"
              name="idxOPTBUY_commission"
              value={formData.idxOPTBUY_commission}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTBUY_strike:</label>
            <input
              type="number"
              name="idxOPTBUY_strike"
              value={formData.idxOPTBUY_strike}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTBUY_allow:</label>
            <select
              name="idxOPTBUY_allow"
              value={formData.idxOPTBUY_allow}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="Not Allowed">Not Allowed</option>
              <option value="Allowed">Allowed</option>
            </select>
          </div>
        </div>
      )}

      {/* Toggle IDXOPTSELL */}
      <div
        onClick={() => setShowIDXOPTSELL(!showIDXOPTSELL)}
        className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showIDXOPTSELL ? 'Hide IDXOPTSELL' : 'Show IDXOPTSELL'}
      </div>

      {/* IDXOPTSELL Fields */}
      {showIDXOPTSELL && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Selling CommissionType:</label>
            <select
              name="idxOPTSELL_commissionType"
              value={formData.idxOPTSELL_commissionType}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="perCrore">perCrore</option>
              <option value="perLot">perLot</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTSELL_commission:</label>
            <input
              type="number"
              name="idxOPTSELL_commission"
              value={formData.idxOPTSELL_commission}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTSELL_strike:</label>
            <input
              type="number"
              name="idxOPTSELL_strike"
              value={formData.idxOPTSELL_strike}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">IDXOPTSELL_allow:</label>
            <select
              name="idxOPTSELL_allow"
              value={formData.idxOPTSELL_allow}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="Not Allowed">Not Allowed</option>
              <option value="Allowed">Allowed</option>
            </select>
          </div>
        </div>
      )}

      {/* Toggle IDXOPT */}
      <div
        onClick={() => setShowIDXOPT(!showIDXOPT)}
        className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showIDXOPT ? 'Hide IDXOPT' : 'Show IDXOPT'}
      </div>

      {/* IDXOPT Fields */}
      {showIDXOPT && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Max Lots:</label>
            <input
              type="number"
              name="idxOPT_maxLots"
              value={formData.idxOPT_maxLots}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Order Lots:</label>
            <input
              type="number"
              name="idxOPT_orderLots"
              value={formData.idxOPT_orderLots}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Expiry Loss Hold:</label>
            <input
              type="number"
              name="idxOPT_expiryLossHold"
              value={formData.idxOPT_expiryLossHold}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Expiry Profit Hold:</label>
            <input
              type="number"
              name="idxOPT_expiryProfitHold"
              value={formData.idxOPT_expiryProfitHold}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Expiry Intraday Margin:</label>
            <input
              type="number"
              name="idxOPT_expiryIntradayMargin"
              value={formData.idxOPT_expiryIntradayMargin}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Limit Percentage:</label>
            <input
              type="number"
              name="idxOPT_limitPercentage"
              value={formData.idxOPT_limitPercentage}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Intraday:</label>
            <input
              type="number"
              name="idxOPT_intraday"
              value={formData.idxOPT_intraday}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Holding:</label>
            <input
              type="number"
              name="idxOPT_holding"
              value={formData.idxOPT_holding}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Index Option Selling Overnight:</label>
            <select
              name="idxOPT_sellingOvernight"
              value={formData.idxOPT_sellingOvernight}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="Not Allowed">Not Allowed</option>
              <option value="Allowed">Allowed</option>
            </select>
          </div>
        </div>
      )}

      {/* Toggle STKOPTBUY */}
      <div
        onClick={() => setShowSTKOPTBUY(!showSTKOPTBUY)}
        className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[50%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showSTKOPTBUY ? 'Hide STKOPTBUY' : 'Show STKOPTBUY'}
      </div>

      {/* STKOPTBUY Fields */}
      {showSTKOPTBUY && (
        <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">Stock Option Buying CommissionType:</label>
            <select
              name="stkOPTBUY_commissionType"
              value={formData.stkOPTBUY_commissionType}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="perCrore">perCrore</option>
              <option value="perLot">perLot</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">STKOPTBUY_commission:</label>
            <input
              type="number"
              name="stkOPTBUY_commission"
              value={formData.stkOPTBUY_commission}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">STKOPTBUY_strike:</label>
            <input
              type="number"
              name="stkOPTBUY_strike"
              value={formData.stkOPTBUY_strike}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-300 text-sm">STKOPTBUY_allow:</label>
            <select
              name="stkOPTBUY_allow"
              value={formData.stkOPTBUY_allow}
              onChange={handleChange}
              className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
            >
              <option value="Not Allowed">Not Allowed</option>
              <option value="Allowed">Allowed</option>
            </select>
          </div>
        </div>
      )}
    </div>

{/* 5 TOGEATHER */}

{/* no1 */}
<div
        onClick={() => setShowSTKOPTSELL(!showSTKOPTSELL)}
        className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[60%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
      >
        {showSTKOPTSELL ? 'Hide Stock Option Selling' : 'Show Stock Option Selling'}
      </div>

      {/* Stock Option Selling (STKOPTSELL) Section */}
      {showSTKOPTSELL && (
      <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">
    
      {/* Commission Type Dropdown */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">Stock Option Selling Commission Type:</label>
        <select
          name="STKOPTSELL_commissionType"
          value={formData.STKOPTSELL_commissionType}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        >
          <option value="perCrore">perCrore</option>
          <option value="perLot">perLot</option>
        </select>
      </div>
    
      {/* Commission */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">STKOPTSELL Commission:</label>
        <input
          type="number"
          name="STKOPTSELL_commission"
          value={formData.STKOPTSELL_commission}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* Strike */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">Stock Option Selling Strike:</label>
        <input
          type="number"
          name="STKOPTSELL_strike"
          value={formData.STKOPTSELL_strike}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        />
      </div>
    
      {/* Allow Dropdown */}
      <div className="mb-4">
        <label className="block font-medium text-gray-300 text-sm">Stock Option Selling Allow:</label>
        <select
          name="STKOPTSELL_allow"
          value={formData.STKOPTSELL_allow}
          onChange={handleChange}
          className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
        >
          <option value="Not Allowed">Not Allowed</option>
          <option value="Allowed">Allowed</option>
        </select>
      </div>
    </div>
    
      )}

{/* no2 */}
<div
  onClick={() => setShowSTKOPT(!showSTKOPT)}
  className="cursor-pointer mt-3 bg-gray-600 hover:bg-blue-700 w-[60%] text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300"
>
  {showSTKOPT ? 'Hide STKOPT' : 'Show STKOPT'}
</div>
{showSTKOPT && (
  <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-md">

  {/* Max Lots */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Max Lots:</label>
    <input
      type="number"
      name="STKOPT_maxLots"
      value={formData.STKOPT_maxLots}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    />
  </div>

  {/* Order Lots */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Order Lots:</label>
    <input
      type="number"
      name="STKOPT_orderLots"
      value={formData.STKOPT_orderLots}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    />
  </div>

  {/* Limit Percentage */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Limit Percentage:</label>
    <input
      type="number"
      name="STKOPT_limitPercentage"
      value={formData.STKOPT_limitPercentage}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    />
  </div>

  {/* Intraday */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Intraday:</label>
    <input
      type="number"
      name="STKOPT_intraday"
      value={formData.STKOPT_intraday}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    />
  </div>

  {/* Holding */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Holding:</label>
    <input
      type="number"
      name="STKOPT_holding"
      value={formData.STKOPT_holding}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    />
  </div>

  {/* Selling Overnight Dropdown */}
  <div className="mb-4">
    <label className="block font-medium text-gray-300 text-sm">Stock Option Selling Overnight:</label>
    <select
      name="STKOPT_sellingOvernight"
      value={formData.STKOPT_sellingOvernight}
      onChange={handleChange}
      className="block bg-gray-800 mt-1 p-3 border border-gray-700 rounded-md w-full text-white"
    >
      <option value="Not Allowed">Not Allowed</option>
      <option value="Allowed">Allowed</option>
    </select>
  </div>
</div>

)}




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