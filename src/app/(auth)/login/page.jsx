'use client'
import { useState ,useEffect} from 'react'
import Cookies from 'js-cookie'
export default function LoginPage () {
  const [serverName, setServerName] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  
  const [loginData, setLoginData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
 // Fetch user info from cookies on page load
 useEffect(() => {
    const storedUser = Cookies.get('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!loginData) return;

    const loginUser = async () => {
      setErrorMessage(null);
      setSuccessMessage('');

      try {
        const response = await fetch('http://localhost:4000/api/v1/loginbrokerusers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'An error occurred');
        }

        setSuccessMessage(data.message);
        setErrorMessage('');

        // Save user info in cookies
        Cookies.set('userInfo', JSON.stringify({
          userId: loginData.userId,
          role: data.role,
          username: data.username,
          id: data.id,
          ledgerBalanceClose: data.ledgerBalanceClose, // ✅ Add this line
        }), { expires: 7 });
        
        
        // Update state to reflect the stored user info
        setUserInfo({
          userId: loginData.userId,
          role: data.role,
          username: data.username,
          id: data.id,
          ledgerBalanceClose: data.ledgerBalanceClose, // ✅ Add this line
        });
        
        

       if (data.role === 'User') {
  window.location.href = `/user-marketwatch/${data.id}`;
}
 else if (data.role === 'Sub-Broker') {
          window.location.href = '/marketwatch';
        }
        else if (data.role === 'Broker') {
            window.location.href = '/dashboard';
          }
          else if (data.role === 'Admin') {
            window.location.href = '/dashboard';
          }
      } catch (error) {
        setErrorMessage(error.message);
        setSuccessMessage('');
      }
    };

    loginUser();
  }, [loginData]);
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginData({ userId, password });
  };

  return (
    <div className='flex justify-center items-center bg-[#0B0F1A] min-h-screen'>
      <div className='bg-[#131927] shadow-md p-6 rounded-lg w-96 text-white'>
        <div className='flex justify-center mb-4'>
          <h1 className='font-bold text-3xl'>
            <span className='text-white'>ne</span>
            <span className='text-blue-500 text-5xl'>x</span>
          </h1>
        </div>

        {successMessage && (
          <div className='mt-4 p-2 border border-green-500 rounded text-green-500'>
            {successMessage}
          </div>
        )}

        {error && <p className='text-red-400 text-sm text-center'>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-gray-300'>Server Name</label>
            <input
              type='text'
              className='bg-[#1C2333] p-2 border rounded w-full text-white'
              value='Falcon trade'
              name='server'
              onChange={e => setServerName(e.target.value)}
              required
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-300'>User ID</label>
            <input
              type='text'
              className='bg-[#1C2333] p-2 border rounded w-full text-white'
              value={userId}
              name='userid'
              onChange={e => setUserId(e.target.value)}
              required
            />
          </div>

          <div className='relative mb-4'>
            <label className='block text-gray-300'>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className='bg-[#1C2333] p-2 border rounded w-full text-white'
              value={password}
              name='password'
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className='top-8 right-3 absolute text-gray-400 cursor-pointer'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          <button className='bg-green-500 hover:bg-green-600 p-2 rounded w-full font-bold text-white'>
            Login
          </button>
        </form>

        <p className='mt-4 text-gray-400 text-sm text-center'>
          © Copyright @ 2024. All Rights Reserved. <br />
          Arth Vraddhi Solutions.
        </p>
      </div>
    </div>
  )
}
