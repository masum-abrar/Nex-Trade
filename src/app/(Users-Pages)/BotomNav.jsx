import Link from "next/link";
import { FaChartBar, FaShoppingCart, FaBolt, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie
const BottomNav = () => {
  const [currentPath, setCurrentPath] = useState("");
  const [userInfo, setUserInfo] = useState(null);


   useEffect(() => {
        const storedUser = Cookies.get('userInfo');
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        }
      }, []);
  useEffect(() => {
    // Update the current path on mount
    setCurrentPath(window.location.pathname);
  }, []);
   const handleLogout = () => {
      Cookies.remove('userId');  // Remove user ID
      Cookies.remove('username'); // Remove username
      Cookies.remove('role');
      Cookies.remove('id');
       // Remove role if needed
  
      router.push('/login'); // Redirect to login page
    };

  // Compare the path with the link's href to set the active class
  const getLinkClass = (linkPath) => {
    return currentPath === linkPath ? "text-blue-500" : "text-gray-400";
  };
    useEffect(() => {
      const storedUser = Cookies.get('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    }, []);

  return (
    <div className="bottom-0 w-full bg-gray-800 flex justify-around py-3 border-t border-gray-700">
       {userInfo && (
    <Link href={`/user-marketwatch/${userInfo.id}`}>
      <div
        className={`flex flex-col items-center hover:text-white transition ${getLinkClass(`/user-marketwatch/${userInfo.id}`)}`}
      >
        <FaChartBar size={20} />
        <span className="text-xs">Market</span>
      </div>
    </Link>
  )}
      <Link href="/user-order">
        <div
          className={`flex flex-col items-center hover:text-white transition ${getLinkClass("/user-order")}`}
        >
          <FaShoppingCart size={20} />
          <span className="text-xs">Orders</span>
        </div>
      </Link>
      <Link href="/user-position">
        <div
          className={`flex flex-col items-center hover:text-white transition ${getLinkClass("/user-position")}`}
        >
          <FaBolt size={20} />
          <span className="text-xs">Position</span>
        </div>
      </Link>
      <Link href="/user-profile">
        <div
          className={`flex flex-col items-center hover:text-white transition ${getLinkClass("/user-profile")}`}
        >
          <FaCog size={20} />
          
          <span className="text-xs font-bold">
  {userInfo?.userId}
</span>
        </div>
      </Link>
    </div>
  );
};

export default BottomNav;
