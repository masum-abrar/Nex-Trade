'use client';
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "MARKETWATCH", href: "/marketwatch" },
    { label: "DASHBOARD", href: "/dashboard" },
    { label: "ORDERS", href: "/orders" },
    { label: "POSITION", href: "/position" },
    { label: "UPDATE", href: "/users" },
    { label: "USERS", href: "/users" },
    { label: "ACT LEDGER", href: "/ledger" },
    { label: "ACCOUNTS", href: "/accounts" },
    { label: "PAYIN-OUT", href: "/payinout" },
  ];
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove('userInfo'); 
  
  
    
    router.push('/login'); 
  };
  return (
    <nav className="bg-[#1A2C38] text-white p-4 border-b border-gray-700">
      <div className="container mx-auto">
        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between">
          <h1 className="text-xl font-bold ml-[40%]">Nex Trade </h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            fixed top-0 right-0 h-full w-1/2 bg-[#0a1929] 
            transform transition-transform duration-300 ease-in-out z-50
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            md:hidden
          `}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="text-sm hover:text-red-400 transition-colors w-full text-left py-2">
              LOGOUT
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between ">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogout}
           className="text-sm hover:text-red-400 transition-colors">
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;