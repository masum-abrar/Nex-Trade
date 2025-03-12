import React from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';


const HomePage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default HomePage;