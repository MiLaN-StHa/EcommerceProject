import React from 'react';
import logo from '../assets/oglogo.png'

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 text-brown-800 font-sans">
      <img
        className="w-40 mb-6"
        src={logo} // Replace with your logo URL
        alt="Logo"
      />
      <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Panel</h1>
      <p className="text-lg text-center mb-6">
        Manage your handcrafted accessories and jewelry with ease. Explore tools to oversee inventory, orders, and more.
      </p>
      <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-lg rounded shadow-md transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Welcome;
