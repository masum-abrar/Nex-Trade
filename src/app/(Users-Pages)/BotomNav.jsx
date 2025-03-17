import Link from "next/link";
import { FaChartBar, FaShoppingCart, FaBolt, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";

const BottomNav = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Update the current path on mount
    setCurrentPath(window.location.pathname);
  }, []);

  // Compare the path with the link's href to set the active class
  const getLinkClass = (linkPath) => {
    return currentPath === linkPath ? "text-blue-500" : "text-gray-400";
  };

  return (
    <div className="bottom-0 w-full bg-gray-800 flex justify-around py-3 border-t border-gray-700">
      <Link href="/user-marketwatch">
        <div
          className={`flex flex-col items-center hover:text-white transition ${getLinkClass("/user-marketwatch")}`}
        >
          <FaChartBar size={20} />
          <span className="text-xs">Market</span>
        </div>
      </Link>
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
          <span className="text-xs">Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default BottomNav;
